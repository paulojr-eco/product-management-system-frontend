import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { Product } from '../../models/product.model';
import { ApiResponse } from '../../models/api-response.model';
import { ProductStore } from '../../models/product-store.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  private product = new BehaviorSubject<Product>(new Product());
  private updateTableProduct = new BehaviorSubject<null>(null);
  updateTable$ = this.updateTableProduct.asObservable();
  private emitValuesFields = new Subject<void>();
  emitValuesFields$ = this.emitValuesFields.asObservable();

  getById(id: number) {
    this.http
      .get<ApiResponse<Product>>(`http://localhost:3000/api/product/${id}`, {
        observe: 'response',
      })
      .subscribe((response) => {
        this.product.next(response.body?.data!);
      });
  }

  deleteProductStore(productStore: ProductStore) {
    this.http
      .delete<ApiResponse<ProductStore>>(
        `http://localhost:3000/api/product-store/${productStore.id}`,
        { observe: 'response' }
      )
      .subscribe((response) => {
        if (response.status >= 200) {
          const productCopy = { ...this.product.value };
          productCopy.produtoLojas = productCopy.produtoLojas.filter(
            (pl) => pl.id !== productStore.id
          );
          this.product.next(productCopy);
        }
      });
  }

  updateProductStore(
    storeId: number,
    salePrice: number,
    productStoreId: number
  ) {
    this.http
      .patch<ApiResponse<ProductStore>>(
        `http://localhost:3000/api/product-store`,
        {
          productStoreParams: {
            id: productStoreId,
            idProduto: this.product.value.id,
            idLoja: storeId,
            precoVenda: salePrice,
          },
        },
        { observe: 'response' }
      )
      .subscribe((response) => {
        if (response.status >= 200) {
          const productCopy = { ...this.product.value };
          const productStoreIndex = productCopy.produtoLojas.findIndex(
            (pl) => pl.id === productStoreId
          );
          if (productStoreIndex !== -1) {
            productCopy.produtoLojas[productStoreIndex].idLoja = storeId;
            productCopy.produtoLojas[productStoreIndex].precoVenda = salePrice;
          }
          this.product.next(productCopy);
        }
      });
  }

  addProductStore(storeId: number, salePrice: number) {
    return this.http
      .post<ApiResponse<ProductStore>>(
        `http://localhost:3000/api/product-store`,
        {
          productStoreParams: {
            idProduto: this.product.value.id,
            idLoja: storeId,
            precoVenda: salePrice,
          },
        },
        { observe: 'response' }
      )
      .pipe(
        tap((response) => {
          if (response.status >= 200) {
            const idNewProductStore = response.body?.data!.id!;
            const productStoreInserted = new ProductStore();
            productStoreInserted.id = idNewProductStore;
            productStoreInserted.idLoja = storeId;
            productStoreInserted.precoVenda = salePrice;
            productStoreInserted.idProduto = this.product.value.id;
            const productCopy = { ...this.product.value };
            productCopy.produtoLojas.push(productStoreInserted);
            this.product.next(productCopy);
          }
        })
      );
  }

  addProductStoreToNewProduct(storeId: number, salePrice: number) {
    const newProductStore = new ProductStore();
    newProductStore.idLoja = storeId;
    newProductStore.precoVenda = salePrice;
    const productCopy = { ...this.product.value };
    productCopy.produtoLojas.push(newProductStore);
    this.product.next(productCopy);
    this.triggerUpdate();
  }

  triggerUpdate() {
    this.updateTableProduct.next(null);
  }

  setProduct(product: Product) {
    this.product.next(product);
  }

  getProduct() {
    return this.product.asObservable();
  }

  eraseProduct() {
    this.product.next(new Product());
  }

  updateProductFields(description: string, cost: string) {
    const productCopy = { ...this.product.value };
    productCopy.descricao = description;
    productCopy.custo = parseFloat(cost);
    this.product.next(productCopy);
  }

  triggerEmitValues() {
    this.emitValuesFields.next();
  }
}
