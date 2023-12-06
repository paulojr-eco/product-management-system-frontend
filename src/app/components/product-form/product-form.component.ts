import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product-service/product-service.service';
import { Buffer } from 'buffer';

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
    private productService: ProductService
  ) {
    this.productService.getProduct().subscribe((product) => {
      this.product = product;
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.productService.getById(Number(this.id));
      if (this.product && this.product.imagem) {
        this.imageSrc =
          'data:image/jpeg;base64,' +
          new Buffer(this.product.imagem).toString('base64');
      }
    } else {
      this.productService.eraseProduct();
    }
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
}
