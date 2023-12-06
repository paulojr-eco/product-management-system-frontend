import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner/spinner.service';

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
    private router: Router,
    private spinnerService: SpinnerService
  ) {
    this.productsService.getFilteredProducts().subscribe((products) => {
      this.products = products;
    });
  }

  ngOnInit() {
    this.spinnerService.show();
    this.productsService.getData().subscribe(() => {
      this.spinnerService.hide();
    });
  }

  onDelete(product: Product) {
    this.spinnerService.show();
    this.productsService.delete(product).subscribe(() => {
      this.spinnerService.hide();
    });
  }

  onEdit(product: Product) {
    this.router.navigate(['product', product.id]);
  }
}
