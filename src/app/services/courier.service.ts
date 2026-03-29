import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Courier {
  id?: number;
  name: string;
  phone: string;
  vehicle: string;
  license_plate: string;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CourierService {
  private apiUrl = `${environment.apiUrl}/couriers`;

  constructor(private http: HttpClient) {}

  getCouriers(): Observable<Courier[]> {
    return this.http.get<Courier[]>(this.apiUrl);
  }

  getAvailableCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/available/count`);
  }

  getCourierById(id: number): Observable<Courier> {
    return this.http.get<Courier>(`${this.apiUrl}/${id}`);
  }

  getCouriersByFilter(filters: Partial<Pick<Courier, 'name' | 'phone' | 'license_plate'>>): Observable<Courier[]> {
    let params = new HttpParams();
    if (filters.name) params = params.set('name', filters.name);
    if (filters.phone) params = params.set('phone', filters.phone);
    if (filters.license_plate) params = params.set('license_plate', filters.license_plate);
    return this.http.get<Courier[]>(`${this.apiUrl}/filter`, { params });
  }

  createCourier(courier: Omit<Courier, 'id'>): Observable<any> {
    return this.http.post(this.apiUrl, courier);
  }

  updateCourier(id: number, courier: Omit<Courier, 'id'>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, courier);
  }

  toggleAvailability(id: number, available: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { available });
  }

  deleteCourier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
