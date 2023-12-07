import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../../services/product/product-service.service';
import { ProductStore } from '../../models/product-store.model';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '../../models/store.model';
import { StoresService } from '../../services/stores/stores.service';
import { Product } from '../../models/product.model';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private productService: ProductService,
    private storeService: StoresService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private dialogRef: MatDialogRef<ProductStoreDialogComponent>,
    private _snackBar: MatSnackBar
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
    this.spinnerService.show();
    if (storeId && salePrice) {
      if (this.currentProductStore.id) {
        this.productService
          .updateProductStore(
            parseInt(storeId),
            parseFloat(salePrice),
            this.currentProductStore.id
          )
          .subscribe({
            next: () => {
              this.dialogRef.close();
              this.spinnerService.hide();
            },
            error: (err) => {
              this.spinnerService.hide();
              this._snackBar.open(err.message, 'Fechar', {
                duration: 5000,
                panelClass: ['red-snackbar'],
              });
              this.spinnerService.hide();
            },
          });
      } else if (this.product.id) {
        this.productService
          .addProductStore(parseInt(storeId), parseFloat(salePrice))
          .subscribe({
            next: () => {
              this.productService.triggerUpdate();
              this.dialogRef.close();
              this.spinnerService.hide();
            },
            error: (err) => {
              this.spinnerService.hide();
              this._snackBar.open(err.message, 'Fechar', {
                duration: 5000,
                panelClass: ['red-snackbar'],
              });
              this.spinnerService.hide();
            },
          });
      } else if (this.data.index === undefined) {
        const result = this.productService.addProductStoreToNewProduct(
          parseInt(storeId),
          parseFloat(salePrice)
        );
        this.spinnerService.hide();
        if (result instanceof Error) {
          this._snackBar.open(result.message, 'Fechar', {
            duration: 5000,
            panelClass: ['red-snackbar'],
          });
        } else {
          this.dialogRef.close();
        }
      } else {
        const result = this.productService.editProductStoreToNewProduct(
          parseInt(storeId),
          parseFloat(salePrice),
          this.data.index
        );
        this.spinnerService.hide();
        if (result instanceof Error) {
          this._snackBar.open(result.message, 'Fechar', {
            duration: 5000,
            panelClass: ['red-snackbar'],
          });
        } else {
          this.dialogRef.close();
        }
      }
    } else {
      this.spinnerService.hide();
      this._snackBar.open(
        'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
        'Fechar',
        {
          duration: 5000,
          panelClass: ['red-snackbar'],
        }
      );
    }
  }
}
