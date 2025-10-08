import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Address{
  id? : number;
  customer_id : number;
  label : string;
  address_text : string;
  reference? : string;
  latitude? : string;
  longitude? : string;
  created_at?: string;
  is_primary: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class AddressService {
  private apiUrl = `${environment.apiUrl}/addresses`;
  constructor(private http: HttpClient) { }

  //Obtener la dirección de un cliente por ID
  getAddressesByCustomerId(id: number): Observable<Address[]>{
    return this.http.get<Address[]>(`${this.apiUrl}/customer/${id}`);
  }
  //Obtener dirección principal del cliente
  getPrimaryAddress(customerId: number): Observable<Address> {
    return this.http.get<Address>(`${this.apiUrl}/primary/${customerId}`);
  }
  //Crear nueva dirección a un cliente
  createAddress(address: Address): Observable<Address>{
    return this.http.post<Address>(this.apiUrl, address)
  }
  //Actualizar dirección
  updateAddress(id: number, address: Partial<Address>): Observable<Address>{
    return this.http.patch<Address>(`${this.apiUrl}/${id}`, address);
  }
  //Eliminar dirección
  deleteAddress(id: number) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
