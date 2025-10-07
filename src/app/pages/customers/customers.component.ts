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

  successMessage = '';
  editingCustomer: Customer | null = null;

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
    this.editingCustomer = null;
    this.customerForm = { name: '', email: '', phone: '' };
    this.showForm = true;
  }

  editCustomer(customer:Customer): void {
    this.editingCustomer = customer;
    this.customerForm = {
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone
    };
    this.showForm = true;
  }

  deleteCustomer(id:number | undefined): void {
    if(id === undefined) {
      console.error('ID de cliente inválido para eliminar');
      return;
    }
    if(confirm('¿Está seguro de que desea eliminar este cliente?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers(); // recargar lista
          this.successMessage = 'Cliente eliminado exitosamente.';
          setTimeout(() => this.successMessage = '', 3000); // limpiar mensaje
        },
        error: (err) => {
          console.error('Error al eliminar cliente:', err);
          alert('No se pudo eliminar el cliente.');
        }
      });
    }
  }

  //-- Cerrar modal de formulario --
  closeForm(): void {
    this.showForm = false;
  }

  //-- Guardar nuevo cliente --
  saveCustomer(): void {
    if(!this.customerForm.name || !this.customerForm.phone) {
      alert('El nombre y teléfono son obligatorios.');
      return;
    }

    //--- Si estamos editando un cliente existente ---
    if(this.editingCustomer) {
      if (!this.editingCustomer || this.editingCustomer.id === undefined) {
      console.error('No se encontró el ID del cliente a editar');
      return;
    }
      this.customerService.updateCustomer(this.editingCustomer.id, this.customerForm).subscribe({
        next: () => {
          this.loadCustomers(); // recargar lista
          this.closeForm();
          this.successMessage = 'Cliente actualizado exitosamente.';
          setTimeout(() => this.successMessage = '', 3000); // limpiar mensaje
        },
        error: (err) => {
          console.error('Error al actualizar cliente:', err);
          alert('No se pudo actualizar el cliente.');
        },
      });
    }else{
    //--- Crear nuevo cliente ---
          this.customerService.createCustomer(this.customerForm).subscribe({
      next: (newCustomer) => {
        this.loadCustomers(); // recargar lista
        this.closeForm(); // cerrar modal
        this.successMessage = 'Cliente creado exitosamente.';
        setTimeout(() => this.successMessage = '', 3000); // limpiar mensaje
      },
      error: (err) => {
        console.error('Error al crear cliente:', err);
        alert('No se pudo crear el cliente.');
      }
    });
    }
  };
}

