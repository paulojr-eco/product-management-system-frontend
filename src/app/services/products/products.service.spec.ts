import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '../../models/product.model';
import { ProductsService } from './products.service';
import { environment } from '../../../environments/environment';
import { apiResponseMock } from '../../mocks/api-response.mock';
import {
  productMock,
  productMockWithoutDescription,
  productMockWithoutProductStore,
} from '../../mocks/product.mock';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getData()', () => {
    it('should fetch data', () => {
      const mockProducts: Product[] = [productMock];
      const mockApiResponse = apiResponseMock({
        data: mockProducts,
        path: '/products',
        duration: '10ms',
        method: 'GET',
      });
      service.getData().subscribe((response) => {
        expect((response.body as any).body).toEqual(mockApiResponse.body);
      });
      const req = httpMock.expectOne(`${environment.apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });
  });

  describe('add()', () => {
    it('should throw if produto.produtoLojas is not defined', () => {
      const mockProduct: Product = productMockWithoutProductStore;
      service.add(mockProduct).subscribe({
        error: (err) => {
          expect(err.message).toBe(
            'Não é possível cadastrar produto sem definir o preço de ao menos uma loja'
          );
        },
      });
    });

    it('should throw if product description param is not defined', () => {
      const mockProduct: Product = productMockWithoutDescription;
      service.add(mockProduct).subscribe({
        error: (err) => {
          expect(err.message).toBe(
            'Um ou mais campos obrigatórios não foram preenchidos corretamente.'
          );
        },
      });
    });

    it('should add product', () => {
      const product: Product = productMock;
      const mockApiResponse = apiResponseMock({
        data: [],
        path: '/product',
        duration: '10ms',
        method: 'POST',
      });
      service.add(product).subscribe((response) => {
        expect((response.body as any).body).toEqual(mockApiResponse.body);
      });
      const req = httpMock.expectOne(`${environment.apiUrl}/product`);
      expect(req.request.method).toBe('POST');
      req.flush(mockApiResponse);
    });
  });

  describe('update()', () => {
    it('should update product', () => {
      const product: Product = productMock;
      service.setProducts([product]);
      service.setFilteredProducts([product]);
      const mockApiResponse = apiResponseMock({
        data: [],
        path: '/product',
        duration: '10ms',
        method: 'PATCH',
      });
      service.update(product).subscribe((response) => {
        expect((response.body as any).body).toEqual(mockApiResponse.body);
      });
      const req = httpMock.expectOne(`${environment.apiUrl}/product`);
      expect(req.request.method).toBe('PATCH');
      req.flush(mockApiResponse);
    });
  });

  describe('delete()', () => {
    it('should delete product', () => {
      const product: Product = productMock;
      service.setProducts([product]);
      service.setFilteredProducts([product]);
      const mockApiResponse = apiResponseMock({
        data: [],
        path: '/product',
        duration: '10ms',
        method: 'DELETE',
      });
      service.delete(product).subscribe((response) => {
        expect((response.body as any).body).toEqual(mockApiResponse.body);
      });
      const req = httpMock.expectOne(
        `${environment.apiUrl}/product/${product.id}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(mockApiResponse);
    });
  });

  describe('setProducts()', () => {
    it('should set and get products', () => {
      const mockProducts: Product[] = [productMock];
      service.setProducts(mockProducts);
      service.getProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });
    });
  });

  describe('setProducts()', () => {
    it('should set and get filtered products', () => {
      const mockProducts: Product[] = [productMock];
      service.setFilteredProducts(mockProducts);
      service.getFilteredProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });
    });
  });
});
