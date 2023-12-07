import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap, throwError } from 'rxjs';
import { Product } from '../../models/product.model';
import { ApiResponse } from '../../models/api-response.model';
import { ProductStore } from '../../models/product-store.model';
import { SpinnerService } from '../spinner/spinner.service';

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
    return this.http
      .get<ApiResponse<Product>>(`http://localhost:3000/api/product/${id}`, {
        observe: 'response',
      })
      .pipe(
        tap((response) => {
          this.product.next(response.body?.data!);
        })
      );
  }

  deleteProductStore(
    productStore: ProductStore,
    spinnerService: SpinnerService
  ) {
    if (this.product.value.id) {
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
          spinnerService.hide();
        });
    } else {
      const productCopy = { ...this.product.value };
      productCopy.produtoLojas = productCopy.produtoLojas.filter(
        (pl) => pl.idLoja !== productStore.idLoja
      );
      this.product.next(productCopy);
      spinnerService.hide();
    }
  }

  alreadyHasProductStore(params: {
    storeId: number;
    productStoreId?: number;
    index?: number;
  }) {
    if (params.productStoreId) {
      const productStoresWithoutCurrent =
        this.product.value.produtoLojas.filter(
          (pl) => pl.id !== params.productStoreId
        );
      if (productStoresWithoutCurrent.length === 0) {
        return false;
      }
      if (
        productStoresWithoutCurrent.some((pl) => pl.idLoja === params.storeId)
      ) {
        return true;
      }
    } else if (params.index !== undefined) {
      const productCopy = { ...this.product.value, produtoLojas: [...this.product.value.produtoLojas] };
      productCopy.produtoLojas.splice(params.index, 1);
      if (productCopy.produtoLojas.length === 0) {
        return false;
      } else if (
        productCopy.produtoLojas.some((pl) => pl.idLoja === params.storeId)
      ) {
        return true;
      }
    } else {
      if (
        this.product.value.produtoLojas.some(
          (pl) => pl.idLoja === params.storeId
        )
      ) {
        return true;
      }
    }
    return false;
  }

  updateProductStore(
    storeId: number,
    salePrice: number,
    productStoreId: number
  ) {
    if (this.alreadyHasProductStore({ storeId, productStoreId })) {
      return throwError(
        () =>
          new Error(
            'Não é permitido mais que um preço de venda para a mesma loja.'
          )
      );
    } else {
      return this.http
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
        .pipe(
          tap((response) => {
            if (response.status >= 200) {
              const productCopy = { ...this.product.value };
              const productStoreIndex = productCopy.produtoLojas.findIndex(
                (pl) => pl.id === productStoreId
              );
              if (productStoreIndex !== -1) {
                productCopy.produtoLojas[productStoreIndex].idLoja = storeId;
                productCopy.produtoLojas[productStoreIndex].precoVenda =
                  salePrice;
              }
              this.product.next(productCopy);
            }
          })
        );
    }
  }

  addProductStore(storeId: number, salePrice: number) {
    if (this.alreadyHasProductStore({ storeId })) {
      return throwError(
        () =>
          new Error(
            'Não é permitido mais que um preço de venda para a mesma loja.'
          )
      );
    } else {
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
  }

  addProductStoreToNewProduct(storeId: number, salePrice: number) {
    if (this.alreadyHasProductStore({ storeId })) {
      return new Error(
        'Não é permitido mais que um preço de venda para a mesma loja.'
      );
    } else {
      const newProductStore = new ProductStore();
      newProductStore.idLoja = storeId;
      newProductStore.precoVenda = salePrice;
      const productCopy = { ...this.product.value };
      productCopy.produtoLojas.push(newProductStore);
      this.product.next(productCopy);
      this.triggerUpdate();
      return;
    }
  }

  editProductStoreToNewProduct(
    storeId: number,
    salePrice: number,
    index: number
  ) {
    if (this.alreadyHasProductStore({ storeId, index })) {
      return new Error(
        'Não é permitido mais que um preço de venda para a mesma loja.'
      );
    } else {
      const productCopy = { ...this.product.value };
      productCopy.produtoLojas[index].idLoja = storeId;
      productCopy.produtoLojas[index].precoVenda = salePrice;
      this.product.next(productCopy);
      this.triggerUpdate();
      return;
    }
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

  updateProductImage(imageSrc: string) {
    const productCopy = { ...this.product.value };
    productCopy.imagem = imageSrc;
    this.product.next(productCopy);
  }

  triggerEmitValues() {
    this.emitValuesFields.next();
  }
}
