import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from 'src/app/services/product.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PriceFormatDirective } from 'src/app/directives/price-format.directive';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, PriceFormatDirective],
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
    is_active: true
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

  //--Abrir modal formulario --
  openForm():void{
    this.editingProduct = null;
    this.productForm = {name:'',description:'',price:0,is_active:true};
    this.showForm = true;
  };

  editProduct(product:Product):void{
   this.editingProduct = product;
   this.productForm = {
      name: product.name,
      description: product.description || '',
      price: product.price,
      is_active: product.is_active
      };
   this.showForm = true;
  }

  deleteProduct(id: number | undefined): void {
  if (id === undefined) {
    console.error('ID del producto inválido para eliminar');
    return;
  }

  if (confirm('¿Está seguro de que desea eliminar permanentemente este producto?')) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
        this.successMessage = 'Producto eliminado exitosamente.';
        setTimeout(() => (this.successMessage = ''), 5000);
      },
      error: (err) => {
        console.error('Error al eliminar el producto:', err);
        alert('No se pudo eliminar el producto.');
      },
    });
  }
}

deactivateProduct(id: number | undefined): void {
  if (id === undefined) {
    console.error('ID del producto inválido para desactivar');
    return;
  }

  const product = this.products.find((p) => p.id === id);
  if (product && !product.is_active) {
    alert('El producto ya se encuentra desactivado.');
    return;
  }

  if (confirm('¿Está seguro de que desea desactivar este producto?')) {
    this.productService.deactiveProduct(id).subscribe({
      next: () => {
        this.loadProducts();
        this.successMessage = 'Producto desactivado exitosamente.';
        setTimeout(() => (this.successMessage = ''), 5000);
      },
      error: (err) => {
        console.error('Error al desactivar producto:', err);
        alert('No se pudo desactivar el producto.');
      },
    });
  }
}

    //-- Cerrar modal de formulario --
  closeForm(): void {
    this.showForm = false;
  }

  saveProduct():void{
    if(!this.productForm.name || !this.productForm.price){
      alert('El nombre y precio son obligatorios.');
      return;
    }
    //--- Si estamos editando un producto existente ---
    if(this.editingProduct) {
      if (!this.editingProduct || this.editingProduct.id === undefined) {
      console.error('No se encontró el ID del producto a editar');
      return;
    }
      this.productService.updateProduct(this.editingProduct.id, this.productForm).subscribe({
        next: () => {
          this.loadProducts(); // recargar lista
          this.closeForm();
          this.successMessage = 'producto actualizado exitosamente.';
          setTimeout(() => this.successMessage = '', 5000); // limpiar mensaje
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
          alert('No se pudo actualizar el producto.');
        },
      });
    }
    else{
      this.productService.createProduct(this.productForm).subscribe({
        next: (newProduct) => {
          this.loadProducts();
          this.closeForm();
          this.successMessage = 'Producto creado exitosamente.';
          setTimeout(() => this.successMessage = '', 5000); // limpiar mensaje
        },
        error: (err) => {
        console.error('Error al crear producto:', err);
        alert('No se pudo crear el producto.');
      }
      });
    }
  }

}
