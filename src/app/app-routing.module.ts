import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

const routes: Routes = [
  { path: '', component: ProductSearchComponent },
  { path: 'product', component: ProductFormComponent },
  { path: 'product/:id', component: ProductFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
