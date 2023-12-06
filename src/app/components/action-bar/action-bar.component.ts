import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service/product-service.service';
import { ProductsService } from '../../services/products-service/products.service';
import { Product } from '../../models/product.model';

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
      default:
        break;
    }
  }
}
