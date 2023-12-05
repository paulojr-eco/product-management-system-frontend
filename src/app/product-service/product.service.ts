import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getData(): Observable<HttpResponse<ApiResponse<Product[]>>> {
    return this.http.get<ApiResponse<Product[]>>(
      'http://localhost:3000/api/products', { observe: 'response' }
    );
  }

  delete(product: Product): Observable<HttpResponse<ApiResponse<Product>>> {
    return this.http.delete<ApiResponse<Product>>(
      `http://localhost:3000/api/product/${product.id}`, { observe: 'response' }
    );
  }
}
