import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service/product-service.service';
import { ProductsService } from '../../services/products-service/products.service';
import { Product } from '../../models/product.model';
import { ProductFormFieldsComponent } from '../product-form-fields/product-form-fields.component';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss',
})
export class ActionBarComponent {
  @Input() title!: string;
  @Input() actions!: string[];
  product!: Product;
  constructor(
    private router: Router,
    private productService: ProductService,
    private productsService: ProductsService
  ) {
    this.productService.getProduct().subscribe((product) => {
      this.product = product;
    });
  }

  handleAction(action: string) {
    switch (action) {
      case 'add':
        this.router.navigate(['product']);
        break;
      case 'delete':
        this.productsService.delete(this.product).subscribe(() => {
          this.router.navigate(['']);
        });
        break;
      case 'save':
        this.productService.triggerEmitValues();
        this.productsService.save(this.product).subscribe(() => {
          this.router.navigate(['']);
        });
        break;
      default:
        break;
    }
  }
}
