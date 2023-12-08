import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { ProductStore } from '../../models/product-store.model';
import { MatDialog } from '@angular/material/dialog';
import { ProductStoreDialogComponent } from '../product-store-dialog/product-store-dialog.component';
import { StoresService } from '../../services/stores/stores.service';
import { Store } from '../../models/store.model';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-form-table',
  templateUrl: './product-form-table.component.html',
  styleUrl: './product-form-table.component.scss',
})
export class ProductFormTableComponent implements OnInit, OnDestroy, AfterViewInit {
  productsStore: ProductStore[] = [];
  dataSource!: MatTableDataSource<ProductStore>;
  stores: Store[] = [];
  columnsToDisplay = ['idLoja', 'precoVenda'];
  private subscription!: Subscription;
  @ViewChild('tableProduct') tableProduct!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private storeService: StoresService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService
  ) {
    this.productService.getProduct().subscribe((product) => {
      this.productsStore = product.produtoLojas;
      this.dataSource = new MatTableDataSource(this.productsStore);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openAddOrEditDialog(index?: number, productStore?: ProductStore) {
    this.dialog.open(ProductStoreDialogComponent, {
      data: { 
        productStore: productStore,
        index: index,
      },
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
