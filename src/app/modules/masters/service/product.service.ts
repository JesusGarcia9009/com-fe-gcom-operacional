import { ProductModel, ProductSelectModel } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public elementSelected: ProductModel;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<ProductModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PRODUCT_LIST_ENDPOINT}`).pipe();
  }

  getAllSelect(): Observable<Array<ProductSelectModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PRODUCT_LIST_SELECT_ENDPOINT}`).pipe();
  }

  findById(id: number): Observable<ProductModel> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PRODUCT_FIND_ENDPOINT}${id}`).pipe();
  }

  save(item: ProductModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PRODUCT_SAVE_ENDPOINT}`, item)
      .pipe();
  }

  delete(item: ProductModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PRODUCT_DELETE_ENDPOINT}`, item).pipe();
  }
}
