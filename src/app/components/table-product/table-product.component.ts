import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-table-product',
  templateUrl: './table-product.component.html',
  styleUrls: ['table-product.component.scss'],
})
export class TableProductComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  dataSource!: MatTableDataSource<Product>;
  columnsToDisplay = ['id', 'descricao', 'custo'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private spinnerService: SpinnerService
  ) {
    this.productsService.getFilteredProducts().subscribe((products) => {
      this.products = products;
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (
        data: any,
        sortHeader: string
      ): string => {
        if (typeof data[sortHeader] === 'string') {
          return data[sortHeader].toLocaleLowerCase();
        }

        return data[sortHeader];
      };
    });
  }

  ngOnInit() {
    this.spinnerService.show();
    this.productsService.getData().subscribe(() => {
      this.spinnerService.hide();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
