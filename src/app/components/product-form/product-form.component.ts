import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product/product.service';
import { Buffer } from 'buffer';
import { SpinnerService } from '../../services/spinner/spinner.service';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  id: string | null = null;
  product!: Product;
  imageSrc!: string;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private spinnerService: SpinnerService
  ) {
    this.productService.getProduct().subscribe((product) => {
      this.product = product;
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.spinnerService.show();
      this.productService.getById(Number(this.id)).subscribe((response) => {
        if (response.status >= 200) {
          if (this.product && this.product.imagem) {
            const bufferImage = Buffer.from(this.product.imagem);
            this.imageSrc = bufferImage.toString('utf-8');
          }
        }
        this.spinnerService.hide();
      });
    } else {
      this.productService.eraseProduct();
    }
    this.productService.emitValuesFields$.subscribe(() => {
      this.emitValue();
    });
  }

  handleImageChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  emitValue() {
    this.productService.updateProductImage(this.imageSrc);
  }
}
