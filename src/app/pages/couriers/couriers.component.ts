import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CourierService, Courier } from '../../services/courier.service';

@Component({
  selector: 'app-couriers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './couriers.component.html',
})
export class CouriersComponent implements OnInit {
  couriers: Courier[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  searchType: 'id' | 'name' | 'phone' | 'license_plate' | 'vehicle' = 'id';
  private searchSubject = new Subject<string>();

  showForm = false;
  successMessage = '';
  editingCourier: Courier | null = null;

  courierForm = {
    name: '',
    phone: '',
    vehicle: '',
    license_plate: '',
    available: true,
  };

  constructor(private courierService: CourierService) {}

  ngOnInit(): void {
    this.loadCouriers();
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm = term.trim();
        this.searchCourier();
      });
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  loadCouriers(): void {
    this.loading = true;
    this.error = '';
    this.courierService.getCouriers().subscribe({
      next: (data) => {
        this.couriers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading couriers:', err);
        this.error = 'No se pudieron cargar los domiciliarios.';
        this.loading = false;
      },
    });
  }

  searchCourier(): void {
    const term = this.searchTerm.trim();
    if (!term) {
      this.loadCouriers();
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.searchType === 'id') {
      const id = parseInt(term);
      if (isNaN(id)) {
        this.error = 'El ID debe ser un número válido.';
        this.loading = false;
        return;
      }
      this.courierService.getCourierById(id).subscribe({
        next: (data) => {
          this.couriers = data ? [data] : [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error searching courier by ID:', err);
          this.error = 'No se pudo encontrar el domiciliario.';
          this.loading = false;
        },
      });
      return;
    }

    const filters: Partial<Pick<Courier, 'name' | 'phone' | 'license_plate' | 'vehicle'>> = {};
    if (this.searchType === 'name') filters.name = term;
    if (this.searchType === 'phone') filters.phone = term;
    if (this.searchType === 'license_plate') filters.license_plate = term;
    if (this.searchType === 'vehicle') filters.vehicle = term;

    this.courierService.getCouriersByFilter(filters).subscribe({
      next: (data) => {
        this.couriers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error filtering couriers:', err);
        this.error = 'No se pudieron buscar los domiciliarios.';
        this.loading = false;
      },
    });
  }

  onSearchTypeChange(): void {
    this.searchTerm = '';
    this.loadCouriers();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchType = 'id';
    this.error = '';
    this.successMessage = '';
    this.loadCouriers();
  }

  openForm(): void {
    this.editingCourier = null;
    this.courierForm = { name: '', phone: '', vehicle: '', license_plate: '', available: true };
    this.showForm = true;
  }

  editCourier(courier: Courier): void {
    this.editingCourier = courier;
    this.courierForm = {
      name: courier.name,
      phone: courier.phone,
      vehicle: courier.vehicle,
      license_plate: courier.license_plate,
      available: courier.available,
    };
    this.showForm = true;
  }

  requiresLicensePlate(): boolean {
    return this.courierForm.vehicle === 'Carro' || this.courierForm.vehicle === 'Moto';
  }

  saveCourier(): void {
    if (!this.courierForm.name || !this.courierForm.phone || !this.courierForm.vehicle) {
      alert('Nombre, teléfono y vehículo son obligatorios.');
      return;
    }

    if (this.requiresLicensePlate() && !this.courierForm.license_plate) {
      alert('La placa es obligatoria para Carro y Moto.');
      return;
    }

    if (!this.requiresLicensePlate()) {
      this.courierForm.license_plate = '';
    }

    if (this.editingCourier) {
      if (!this.editingCourier.id) {
        console.error('No courier ID found for update');
        return;
      }
      this.courierService.updateCourier(this.editingCourier.id, this.courierForm).subscribe({
        next: () => {
          this.loadCouriers();
          this.closeForm();
          this.successMessage = 'Domiciliario actualizado exitosamente.';
          setTimeout(() => (this.successMessage = ''), 5000);
        },
        error: (err) => {
          console.error('Error updating courier:', err);
          alert('No se pudo actualizar el domiciliario.');
        },
      });
    } else {
      this.courierService.createCourier(this.courierForm).subscribe({
        next: () => {
          this.loadCouriers();
          this.closeForm();
          this.successMessage = 'Domiciliario creado exitosamente.';
          setTimeout(() => (this.successMessage = ''), 5000);
        },
        error: (err) => {
          console.error('Error creating courier:', err);
          alert('No se pudo crear el domiciliario.');
        },
      });
    }
  }

  toggleAvailability(courier: Courier): void {
    if (!courier.id) return;
    const newAvailability = !courier.available;
    this.courierService.toggleAvailability(courier.id, newAvailability).subscribe({
      next: () => {
        courier.available = newAvailability;
        const status = newAvailability ? 'disponible' : 'no disponible';
        this.successMessage = `Domiciliario marcado como ${status}.`;
        setTimeout(() => (this.successMessage = ''), 5000);
      },
      error: (err) => {
        console.error('Error toggling availability:', err);
        alert('No se pudo cambiar la disponibilidad del domiciliario.');
      },
    });
  }

  deleteCourier(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm('¿Está seguro de que desea eliminar este domiciliario?')) {
      this.courierService.deleteCourier(id).subscribe({
        next: () => {
          this.loadCouriers();
          this.successMessage = 'Domiciliario eliminado exitosamente.';
          setTimeout(() => (this.successMessage = ''), 5000);
        },
        error: (err) => {
          console.error('Error deleting courier:', err);
          alert('No se pudo eliminar el domiciliario.');
        },
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
  }
}
