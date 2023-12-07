import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '../../models/product.model';
import { ProductsService } from './products.service';
import { environment } from '../../../environments/environment.development';
import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiResponse } from '../../models/api-response.model';

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

  it('should fetch data', () => {
    const mockProducts: Product[] = [];
    const mockApiResponse: HttpResponse<ApiResponse<Product[]>> = {
      body: {
        data: mockProducts,
        path: '',
        duration: '',
        method: '',
      },
      type: HttpEventType.Response,
      clone: function (): HttpResponse<ApiResponse<Product[]>> {
        throw new Error();
      },
      headers: new HttpHeaders,
      status: 200,
      statusText: '',
      url: null,
      ok: false
    };

    service.getData().subscribe((response) => {
      expect(response).toEqual(mockApiResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });
});
