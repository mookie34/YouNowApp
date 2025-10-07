import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService, Customer } from '../../services/customer';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./customers.component.html',
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;
  error = '';

  //-- Variables para el formulario de creación de clientes --
  showForm = false;
  customerForm = {
    name:'',
    email:'',
    phone:''
  };

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.error = '';

    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.error = 'No se pudieron cargar los clientes.';
        this.loading = false;
      },
    });
  }

  //-- Abrir modal de formulario --
  openForm(): void {
    this.customerForm = { name: '', email: '', phone: '' };
    this.showForm = true;
  };
  //-- Cerrar modal de formulario --
  closeForm(): void {
    this.showForm = false;
  };

  //-- Guardar nuevo cliente --
  saveCustomer(): void {
    if(!this.customerForm.name || !this.customerForm.phone) {
      alert('El nombre y teléfono son obligatorios.');
      return;
    }

    this.customerService.createCustomer(this.customerForm).subscribe({
      next: (newCustomer) => {
        this.loadCustomers(); // recargar lista
        this.closeForm(); // cerrar modal
      },
      error: (err) => {
        console.error('Error al crear cliente:', err);
        alert('No se pudo crear el cliente.');
      }
    });
  };

}

