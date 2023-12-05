import { Component } from '@angular/core';
import { ProductService } from '../../services/product-service/product-service.service';
import { Product } from '../../models/product.model';
import { ProductStore } from '../../models/product-store.model';

@Component({
  selector: 'app-product-form-table',
  templateUrl: './product-form-table.component.html',
  styleUrl: './product-form-table.component.scss',
})
export class ProductFormTableComponent {
  productsStore: ProductStore[] = [];
  columnsToDisplay = ['loja', 'preco-venda'];

  constructor(private productService: ProductService) {
    this.productService.getProduct().subscribe((product) => {
      this.productsStore = product.produtoLojas;
    });
  }
}
