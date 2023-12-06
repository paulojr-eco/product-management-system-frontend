import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../../models/product.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  private product = new BehaviorSubject<Product>(new Product());

  getById(id: number) {
    this.http
      .get<ApiResponse<Product>>(`http://localhost:3000/api/product/${id}`, {
        observe: 'response',
      })
      .subscribe((response) => {
        this.product.next(response.body?.data!);
      });
  }

  setProduct(product: Product) {
    this.product.next(product);
  }

  getProduct() {
    return this.product.asObservable();
  }
}
