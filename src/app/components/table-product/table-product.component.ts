import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-product',
  templateUrl: './table-product.component.html',
  styleUrls: ['table-product.component.scss'],
})
export class TableProductComponent implements OnInit {
  products: Product[] = [];
  columnsToDisplay = ['codigo', 'descricao', 'custo'];

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {
    this.productsService.getFilteredProducts().subscribe((products) => {
      this.products = products;
    });
  }

  ngOnInit() {
    this.productsService.getData();
  }

  onDelete(product: Product) {
    this.productsService.delete(product).subscribe(() => {});
  }

  onEdit(product: Product) {
    this.router.navigate(['product', product.id]);
  }
}
