import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../../models/product.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  private products = new BehaviorSubject<Product[]>([]);
  private filteredProducts = new BehaviorSubject<Product[]>([]);

  getData() {
    this.http
      .get<ApiResponse<Product[]>>('http://localhost:3000/api/products', {
        observe: 'response',
      })
      .subscribe((response) => {
        this.products.next(response.body?.data!);
        this.filteredProducts.next(response.body?.data!);
      });
  }

  delete(product: Product) {
    this.http
      .delete<ApiResponse<Product>>(
        `http://localhost:3000/api/product/${product.id}`,
        { observe: 'response' }
      )
      .subscribe((response) => {
        if (response.status === 200) {
          this.products.next(this.products.value.filter((p) => p !== product));
          this.filteredProducts.next(
            this.products.value.filter((p) => p !== product)
          );
        }
      });
  }

  setProducts(products: Product[]) {
    this.products.next(products);
  }

  getProducts() {
    return this.products.asObservable();
  }

  setFilteredProducts(products: Product[]) {
    this.filteredProducts.next(products);
  }

  getFilteredProducts() {
    return this.filteredProducts.asObservable();
  }
}
