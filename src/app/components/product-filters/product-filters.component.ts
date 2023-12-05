import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product-service/product.service';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss',
})
export class ProductFiltersComponent {
  private products: Product[] = [];
  datemask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  constructor(private productService: ProductService) {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  applyFilters(id: string, description: string, cost: string, price: string) {
    let filteredProducts = this.products;
    if (id !== '') {
      filteredProducts = filteredProducts.filter(
        (p) => p.id === parseInt(id, 10)
      );
    }
    if (description !== '') {
      filteredProducts = filteredProducts.filter((p) =>
        p.descricao.includes(description)
      );
    }
    if (cost !== '') {
      filteredProducts = filteredProducts.filter(
        (p) => p.custo === parseFloat(cost)
      );
    }
    if (price !== '') {
      filteredProducts = filteredProducts.filter((p) =>
        p.produtoLojas.some((pl) => pl.precoVenda === parseFloat(price))
      );
    }

    this.productService.setFilteredProducts(filteredProducts);
  }
}
