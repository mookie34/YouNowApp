import { Component, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService, Address } from 'src/app/services/address.service';

@Component({
  selector: 'app-address',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})

export class AddressComponent implements OnInit{
  @Input() customerId!: number; 

  addresses: Address[] = [];
  loading = true;
  error ='';
  successMessage = '';
  editingAddress: Address | null = null;

  filteredAddresses: Address[] = [];

  showForm = false;
  addressForm: {
    label: string;
    address_text: string;
    reference: string | null;
    latitude: number;
    longitude: number;
    is_primary: boolean;
} = {
    label: '',
    address_text: '',
    reference: null,
    latitude: 0,
    longitude: 0,
    is_primary: false
};


 

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
      this.addressForm = {label:'',address_text:'',reference:null,latitude:0,longitude:0,is_primary:false}
      this.showForm = true;
  }

  editAddress(address:Address): void{
    this.editingAddress = address;
      this.addressForm = {
        label:address.label,
        address_text:address.address_text,
        reference:address.reference || null,
        latitude:address.latitude || 0,
        longitude:address.longitude||0,
        is_primary:address.is_primary || false
      };
      this.showForm=true;
  }

  deleteAddress(id:number | undefined, idCustomer:number):void{
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
          alert('No se pudo eliminar la dirección, si es principal marque otra dirección como principal antes de eliminar.');
        }
      });
    }
  }

  createAddress():void{
    if(!this.customerId) return;

    const newAddress: Address ={
      customer_id: this.customerId,
      label: this.addressForm.label,
      address_text: this.addressForm.address_text,
      reference: this.addressForm.reference,
      latitude: this.addressForm.latitude,
      longitude: this.addressForm.longitude,
      is_primary: this.addressForm.is_primary
    };

    this.addressService.createAddress(newAddress).subscribe({
      next:()=>{
        this.loadAddresses(this.customerId);
        this.showForm=false;
        this.successMessage = 'Dirección creada correctamente.';
        setTimeout(()=>(this.successMessage=''),4000);
      },
      error: (err) => console.error('Error al crear dirección:', err)
    });
  }

  updateAddress():void{
    if(!this.editingAddress || !this.editingAddress.id) return;

    const updatedAddress:Address ={
      ...this.editingAddress,
      ...this.addressForm,
      latitude:this.addressForm.latitude,
      longitude:this.addressForm.longitude
    };

    this.addressService.updateAddress(this.editingAddress.id, updatedAddress).subscribe({
      next: () => {
        this.loadAddresses(this.customerId);
        this.showForm = false;
        this.successMessage = 'Dirección actualizada correctamente.';
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: (err) => console.error('Error al actualizar dirección:', err)
    });
  }

    closeForm(): void {
    this.showForm = false;
  }

}
