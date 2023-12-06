import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStoreDialogComponent } from './product-store-dialog.component';

describe('ProductStoreDialogComponent', () => {
  let component: ProductStoreDialogComponent;
  let fixture: ComponentFixture<ProductStoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductStoreDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductStoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
