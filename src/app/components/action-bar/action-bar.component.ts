import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product-service/product-service.service';
import { ProductsService } from '../../services/products-service/products.service';
import { Product } from '../../models/product.model';
import { ProductFormFieldsComponent } from '../product-form-fields/product-form-fields.component';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss',
})
export class ActionBarComponent implements OnInit {
  @Input() title!: string;
  @Input() actions!: string[];
  product!: Product;
  idRoute: string | null = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private productsService: ProductsService
  ) {
    this.productService.getProduct().subscribe((product) => {
      this.product = product;
    });
  }

  ngOnInit() {
    this.idRoute = this.route.snapshot.paramMap.get('id');
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
        if (this.idRoute) {
          this.productsService.update(this.product).subscribe(() => {
            this.router.navigate(['']);
          });
        } else {
          this.productsService.add(this.product).subscribe(() => {
            this.router.navigate(['']);
          });
        }
        break;
      default:
        break;
    }
  }
}
