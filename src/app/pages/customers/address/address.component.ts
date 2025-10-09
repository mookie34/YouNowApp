import { Component, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { AddressService, Address } from 'src/app/services/address.service';

@Component({
  selector: 'app-address',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})

export class AddressComponent implements OnInit{
  @Input() customerId!: number; //Recibe el ID del cliente desde el padre
  addresses: Address[] = [];
  loading = true;
  error ='';
  filteredAddresses: Address[] = [];

  showForm = false;
  addressForm = {
    label:'',
    address_text:'',
    reference:'',
    latitude:0,
    longitude:0
  };

  successMessage = '';
  editingAddress: Address | null = null;

  constructor(private addressService: AddressService){}

  ngOnInit(): void {
    if(this.customerId){
      this.loadAddresses(this.customerId);
    }else{
      console.error('No se recibió un ID de cliente válido.');
    }

  }

  loadAddresses(id:number):void{
    this.loading=true;
    this.error='';
    if(id === undefined) {
      console.error('ID de cliente inválido');
      return;
    }

    this.addressService.getAddressesByCustomerId(id).subscribe({
      next:(data) =>{
        this.addresses = Array.isArray(data) ? data : [data];
        this.loading = false;
      },
      error: (err) => {
          console.error('Error al buscar las direcciones del cliente:', err);
          this.error = 'No se pudo buscar las direcciones del cliente.';
          this.loading = false;
        },
    });
  }

   openForm():void{
      this.editingAddress = null;
      this.addressForm = {label:'',address_text:'',reference:'',latitude:0,longitude:0}
      this.showForm = true;
  }

  editAddress(address:Address): void{
    this.editingAddress = address;
      this.addressForm = {
        label:address.label,
        address_text:address.address_text,
        reference:address.reference || '',
        latitude:address.latitude || 0,
        longitude:address.longitude||0
      };
      this.showForm=true;
  }

  deleteAddress(id:number | undefined, idCustomer:number | undefined):void{
    if(id == undefined){
      console.error('ID de la dirección inválida para eliminar');
      return;
    }
     if(confirm('¿Está seguro de que desea eliminar esta dirección?')) {
      this.addressService.deleteAddress(id).subscribe({
        next: () => {
          this.loadAddresses(idCustomer); // recargar lista
          setTimeout(() => {
          this.successMessage = 'Dirección eliminada exitosamente.';
          setTimeout(() => this.successMessage = '', 4000);
          }, 300);
        },
        error: (err) => {
          console.error('Error al eliminar dirección:', err);
          alert('No se pudo eliminar la dirección.');
        }
      });
    }
  }

    closeForm(): void {
    this.showForm = false;
  }

}
