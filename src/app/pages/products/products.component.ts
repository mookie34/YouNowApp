import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from 'src/app/services/product.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  products: Product[]=[];
  loading = true;
  error = '';
  searchTerm = '';
  searchType: 'id' | 'filter' = 'id';
  filteredProducts: Product[] = [];
  private searchSubject = new Subject<string>();

  //-- Variables para el formulario de creación de producto --
  showForm = false;
  productForm = {
    name: '',
    description: '',
    price: 0,
    isActive: false
  };

  successMessage = '';
  editingProduct: Product | null = null;
  selectedProduct:any=null;

  constructor(private productService:ProductService){}

  ngOnInit(): void{
    this.loadProducts();
  }

  loadProducts():void{
    this.loading = true;
    this.error='';

    this.productService.getProducts().subscribe({
      next: (data) =>{
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos.';
        this.loading = false;
      },
    });
  }

}
