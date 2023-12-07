import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '../../models/store.model';
import { ApiResponse } from '../../models/api-response.model';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoresService {
  private stores = new BehaviorSubject<Store[]>([]);

  constructor(private http: HttpClient) {
    this.http
      .get<ApiResponse<Store[]>>(`${environment.apiUrl}/stores`, {
        observe: 'response',
      })
      .subscribe((response) => {
        this.stores.next(response.body?.data!);
      });
  }

  getStores() {
    return this.stores.asObservable();
  }


}
