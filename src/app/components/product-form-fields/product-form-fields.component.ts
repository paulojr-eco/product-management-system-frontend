import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product-service/product-service.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form-fields',
  templateUrl: './product-form-fields.component.html',
  styleUrl: './product-form-fields.component.scss',
})
export class ProductFormFieldsComponent implements AfterViewInit {
  product: Product = new Product();
  @ViewChild('costInput') costInput!: ElementRef;

  constructor(private productService: ProductService) {
    this.productService.getProduct().subscribe((product) => {
      this.product = product;
    });
  }

  ngAfterViewInit() {
    if (this.product) {
      this.costInput.nativeElement.value = this.product.custo || '';
    }
  }
}
