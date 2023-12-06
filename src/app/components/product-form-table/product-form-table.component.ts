import { Component } from '@angular/core';
import { ProductService } from '../../services/product-service/product-service.service';
import { ProductStore } from '../../models/product-store.model';
import { MatDialog } from '@angular/material/dialog';
import { ProductStoreDialogComponent } from '../product-store-dialog/product-store-dialog.component';

@Component({
  selector: 'app-product-form-table',
  templateUrl: './product-form-table.component.html',
  styleUrl: './product-form-table.component.scss',
})
export class ProductFormTableComponent {
  productsStore: ProductStore[] = [];
  columnsToDisplay = ['loja', 'preco-venda'];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {
    this.productService.getProduct().subscribe((product) => {
      this.productsStore = product.produtoLojas;
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ProductStoreDialogComponent);
  }
}
