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
  products: Product[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  searchType: 'id' | 'name' = 'id';
  private searchSubject = new Subject<string>();

  showFilters = false;
  minPrice?: number;
  maxPrice?: number;
  isActive: string = '';

  showForm = false;
  successMessage = '';
  editingProduct: Product | null = null;
  selectedProduct: any = null;

  productForm = {
    name: '',
    description: '',
    price: 0,
    is_active: true,
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();

    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm = term.trim();
        this.searchProduct();
      });
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getProducts().subscribe({
      next: (data) => {
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

  searchProduct(): void {
    const term = this.searchTerm.trim();

    if (!term && !this.minPrice && !this.maxPrice && this.isActive === '') {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.error = '';

    const filters: any = {};

    if (this.searchType === 'id' && term) {
      const id = parseInt(term);
      if (isNaN(id)) {
        this.error = 'El ID debe ser un número válido.';
        this.loading = false;
        return;
      }

      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.products = data ? [data] : [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al buscar producto por ID:', err);
          this.error = 'No se pudo buscar el producto.';
          this.loading = false;
        },
      });

      return;
    }

    if (this.searchType === 'name' && term) {
      filters.name = term;
    }

    if (this.minPrice) filters.min_price = this.minPrice;
    if (this.maxPrice) filters.max_price = this.maxPrice;
    if (this.isActive !== '') filters.is_active = this.isActive === 'true';

    this.productService.getProductForFilter(filters).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al buscar productos:', err);
        this.error = 'No se pudo buscar los productos.';
        this.loading = false;
      },
    });
  }


  clearInputSearch(): void {
    this.searchTerm = '';
    this.searchType = 'name';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.isActive = '';
    this.showFilters = false;
    this.error = '';
    this.successMessage = '';
    this.loadProducts();
  }


  openForm(): void {
    this.editingProduct = null;
    this.productForm = { name: '', description: '', price: 0, is_active: true };
    this.showForm = true;
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm = {
      name: product.name,
      description: product.description || '',
      price: product.price,
      is_active: product.is_active,
    };
    this.showForm = true;
  }


  deleteProduct(id: number | undefined): void {
    if (id === undefined) return;

    if (confirm('¿Está seguro de que desea eliminar permanentemente este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.successMessage = 'Producto eliminado exitosamente.';
          setTimeout(() => (this.successMessage = ''), 5000);
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          alert('No se pudo eliminar el producto.');
        },
      });
    }
  }


  deactivateProduct(id: number | undefined): void {
    if (id === undefined) return;

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

  saveProduct(): void {
    if (!this.productForm.name || !this.productForm.price) {
      alert('El nombre y precio son obligatorios.');
      return;
    }

    if (this.editingProduct) {
      if (!this.editingProduct.id) {
        console.error('No se encontró el ID del producto a editar');
        return;
      }

      this.productService.updateProduct(this.editingProduct.id, this.productForm).subscribe({
        next: () => {
          this.loadProducts();
          this.closeForm();
          this.successMessage = 'Producto actualizado exitosamente.';
          setTimeout(() => (this.successMessage = ''), 5000);
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
          alert('No se pudo actualizar el producto.');
        },
      });
    } else {
      this.productService.createProduct(this.productForm).subscribe({
        next: () => {
          this.loadProducts();
          this.closeForm();
          this.successMessage = 'Producto creado exitosamente.';
          setTimeout(() => (this.successMessage = ''), 5000);
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
          alert('No se pudo crear el producto.');
        },
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
  }
}
