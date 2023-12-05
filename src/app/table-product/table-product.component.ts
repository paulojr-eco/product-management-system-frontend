import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product-service/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-table-product',
  templateUrl: './table-product.component.html',
  styleUrls: ['table-product.component.scss'],
})
export class TableProductComponent implements OnInit {
  products: Product[] = [];
  columnsToDisplay = ['codigo', 'descricao', 'custo'];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getData().subscribe((response) => {
      if (response.body?.data) {
        this.products = response.body.data;
      }
    });
  }

  onDelete(product: Product) {
    this.productService.delete(product).subscribe((response) => {
      if (response.status === 200) {
        this.products = this.products.filter(p => p !== product);
      }
    });
  }
}
