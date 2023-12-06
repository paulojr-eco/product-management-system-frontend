import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../../services/product-service/product-service.service';
import { ProductStore } from '../../models/product-store.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '../../models/store.model';
import { StoresService } from '../../services/stores/stores.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-store-dialog',
  templateUrl: './product-store-dialog.component.html',
  styleUrl: './product-store-dialog.component.scss',
})
export class ProductStoreDialogComponent implements AfterViewInit {
  stores: Store[] = [];
  product: Product = new Product();
  currentProductStore!: ProductStore;
  @ViewChild('salePriceInput') salePriceInput!: ElementRef;

  disableSaveButton = true;

  constructor(
    private productService: ProductService,
    private storeService: StoresService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {
    this.productService.getProduct().subscribe((product) => {
      this.product = product;
    });
    this.storeService.getStores().subscribe((stores) => {
      this.stores = stores;
    });

    if (this.data.productStore) {
      this.currentProductStore = { ...this.data.productStore };
    } else {
      this.currentProductStore = new ProductStore();
    }
  }

  ngAfterViewInit() {
    if (this.currentProductStore) {
      this.salePriceInput.nativeElement.value =
        this.currentProductStore.precoVenda || '';
      this.cdr.detectChanges();
    }
  }

  handleSave(storeId: string, salePrice: string) {
    if (this.currentProductStore.id) {
      this.productService.updateProductStore(
        parseInt(storeId),
        parseFloat(salePrice),
        this.currentProductStore.id
      );
    } else if (this.product.id) {
      this.productService
        .addProductStore(parseInt(storeId), parseFloat(salePrice))
        .subscribe(() => {
          this.productService.triggerUpdate();
        });
    } else {
      this.productService.addProductStoreToNewProduct(parseInt(storeId), parseFloat(salePrice));
    }
  }

  handleDisableSaveButton(store: string, salePrice: string) {
    if (store !== '' && salePrice !== '') {
      this.disableSaveButton = false;
    }
  }
}
