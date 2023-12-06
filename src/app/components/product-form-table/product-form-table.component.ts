import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../../services/product/product-service.service';
import { ProductStore } from '../../models/product-store.model';
import { MatDialog } from '@angular/material/dialog';
import { ProductStoreDialogComponent } from '../product-store-dialog/product-store-dialog.component';
import { StoresService } from '../../services/stores/stores.service';
import { Store } from '../../models/store.model';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'app-product-form-table',
  templateUrl: './product-form-table.component.html',
  styleUrl: './product-form-table.component.scss',
})
export class ProductFormTableComponent implements OnInit, OnDestroy {
  productsStore: ProductStore[] = [];
  stores: Store[] = [];
  columnsToDisplay = ['loja', 'preco-venda'];
  private subscription!: Subscription;
  @ViewChild('tableProduct') tableProduct!: MatTable<any>;

  constructor(
    private productService: ProductService,
    private storeService: StoresService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService
  ) {
    this.productService.getProduct().subscribe((product) => {
      this.productsStore = product.produtoLojas;
    });
    this.storeService.getStores().subscribe((stores) => {
      this.stores = stores;
    });
  }

  ngOnInit() {
    this.subscription = this.productService.updateTable$.subscribe(() => {
      if (this.tableProduct) {
        this.tableProduct.renderRows();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openAddOrEditDialog(productStore?: ProductStore) {
    const dialogRef = this.dialog.open(ProductStoreDialogComponent, {
      data: { productStore: productStore },
    });
  }

  onDelete(productStore: ProductStore) {
    this.spinnerService.show();
    this.productService.deleteProductStore(productStore, this.spinnerService);
  }

  matchStore(id: number) {
    return this.stores.find((store) => store.id === id)?.descricao;
  }
}
