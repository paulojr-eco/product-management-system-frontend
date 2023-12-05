import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products-service/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-table-product',
  templateUrl: './table-product.component.html',
  styleUrls: ['table-product.component.scss'],
})
export class TableProductComponent implements OnInit {
  products: Product[] = [];
  columnsToDisplay = ['codigo', 'descricao', 'custo'];

  constructor(private productService: ProductsService) {
    this.productService.getFilteredProducts().subscribe((products) => {
      this.products = products;
    });
  }

  ngOnInit() {
    this.productService.getData();
  }

  onDelete(product: Product) {
    this.productService.delete(product);
  }
}
