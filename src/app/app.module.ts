import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableProductComponent } from './components/table-product/table-product.component';
import { HttpClientModule } from '@angular/common/http';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ProductFiltersComponent } from './components/product-filters/product-filters.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductFormTableComponent } from './components/product-form-table/product-form-table.component';
import { ProductFormFieldsComponent } from './components/product-form-fields/product-form-fields.component';
import { ProductStoreDialogComponent } from './components/product-store-dialog/product-store-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    TableProductComponent,
    ActionBarComponent,
    ProductFiltersComponent,
    ProductSearchComponent,
    ProductFormComponent,
    ProductFormTableComponent,
    ProductFormFieldsComponent,
    ProductStoreDialogComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatDialogModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSortModule,
  ],
  providers: [provideClientHydration(), provideNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}
