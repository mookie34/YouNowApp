import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Product{
  id?: number;
  name: string;
  description?: string;
  price: number;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient){}

  //Obtener todos los productos
  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(this.apiUrl);
  }
  //Obtener producto por ID
  getProductById(id: number):Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  //Obtener producto por filtro
  getProductForFilter(filters: Partial<Product>): Observable<Product[]>{
    let params = new HttpParams();
    // Agregar parámetros de filtro dinámicamente
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof Product];
      if (value !== undefined && value !== null) {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<Product[]>(`${this.apiUrl}/filter`, { params });
  }
  //Crear un nuevo Producto
  createProduct(product:Product):Observable<Product>{
    return this.http.post<Product>(this.apiUrl, product);
  }
  // Actualizar un producto existente
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
  // Actualizar parcialmente un producto existente
  updateProductPartial(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, product);
  }
  // Eliminar un producto
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
