import { Component } from '@angular/core';
import { ProductService } from '../../services/product-service/product-service.service';
import { ProductStore } from '../../models/product-store.model';

@Component({
  selector: 'app-product-store-dialog',
  templateUrl: './product-store-dialog.component.html',
  styleUrl: './product-store-dialog.component.scss',
})
export class ProductStoreDialogComponent {
  productsStore: ProductStore[] = [];

  constructor(private productService: ProductService) {
    this.productService.getProduct().subscribe((product) => {
      this.productsStore = product.produtoLojas;
    });
  }
}
