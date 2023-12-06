import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product-service.service';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from '../../services/spinner/spinner.service';

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
  disableSaveButton = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private productsService: ProductsService,
    private _snackBar: MatSnackBar,
    private spinnerService: SpinnerService
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
        this.spinnerService.show();
        this.productsService.delete(this.product).subscribe(() => {
          this.spinnerService.hide();
          this.router.navigate(['']);
        });
        break;
      case 'save':
        this.spinnerService.show();
        this.productService.triggerEmitValues();
        if (this.idRoute) {
          this.productsService.update(this.product).subscribe(() => {
            this.spinnerService.hide();
            this.router.navigate(['']);
          });
        } else {
          this.productsService.add(this.product).subscribe({
            next: () => {
              this.spinnerService.hide();
              this.router.navigate(['']);
            },
            error: (err) => {
              this.spinnerService.hide();
              this._snackBar.open(err.message, 'Fechar', {
                duration: 5000,
                panelClass: ['blue-snackbar'],
              });
            },
          });
        }
        break;
      default:
        break;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
