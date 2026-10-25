import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaginatedProducts, IProductQuery } from '../models/product-query';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  public getProducts(query: IProductQuery): Observable<IPaginatedProducts> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    }
    return this.http.get<IPaginatedProducts>(this.apiUrl, { params });
  }

  public deleteProduct(id: number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
