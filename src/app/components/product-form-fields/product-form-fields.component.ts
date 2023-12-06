import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../../services/product-service/product-service.service';
import { Product } from '../../models/product.model';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-product-form-fields',
  templateUrl: './product-form-fields.component.html',
  styleUrl: './product-form-fields.component.scss',
})
export class ProductFormFieldsComponent implements AfterViewInit, OnInit {
  product: Product = new Product();
  @ViewChild('descriptionInput') descriptionInput!: ElementRef;
  @ViewChild('costInput') costInput!: ElementRef;

  constructor(private productService: ProductService) {
    this.productService.getProduct().subscribe((product) => {
      this.product = product;
    });
  }

  ngOnInit() {
    this.productService.emitValuesFields$.subscribe(() => {
      this.emitValues();
    });
  }

  ngAfterViewInit() {
    if (this.product) {
      this.costInput.nativeElement.value = this.product.custo || '';
    }
  }

  emitValues() {
    this.productService.updateProductFields(
      this.descriptionInput.nativeElement.value,
      this.costInput.nativeElement.value
    );
  }
}
