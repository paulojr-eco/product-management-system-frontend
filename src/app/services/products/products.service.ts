import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
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

  add(product: Product) {
    if (!product.produtoLojas || product.produtoLojas.length === 0) {
      return throwError(
        () =>
          new Error(
            'Não é possível cadastrar produto sem definir o preço de ao menos uma loja'
          )
      );
    }

    if (!product.descricao || product.descricao === '' || !product.custo) {
      return throwError(
        () =>
          new Error(
            'Os campos descrição e custo são obrigatórios para cadastrar um produto'
          )
      );
    }

    return this.http.post<ApiResponse<Product>>(
      'http://localhost:3000/api/product',
      {
        productParams: {
          descricao: product.descricao,
          custo: product.custo,
          imagem: product.imagem,
        },
        productStoreParams: product.produtoLojas.map((pl) => ({
          idLoja: pl.idLoja,
          precoVenda: pl.precoVenda,
        })),
      },
      {
        observe: 'response',
      }
    );
  }

  update(product: Product) {
    return this.http.patch<ApiResponse<Product>>(
      'http://localhost:3000/api/product',
      {
        product: {
          id: product.id,
          descricao: product.descricao,
          custo: product.custo,
          imagem: product.imagem,
        },
      },
      {
        observe: 'response',
      }
    );
  }

  delete(product: Product) {
    return this.http
      .delete<ApiResponse<Product>>(
        `http://localhost:3000/api/product/${product.id}`,
        { observe: 'response' }
      )
      .pipe(
        tap((response) => {
          if (response.status >= 200) {
            this.products.next(
              this.products.value.filter((p) => p !== product)
            );
            this.filteredProducts.next(
              this.products.value.filter((p) => p !== product)
            );
          }
        })
      );
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
