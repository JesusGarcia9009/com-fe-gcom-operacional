import { Injectable } from '@angular/core';
import { BillOfBuyModel, ReverseBillOfBuyModel } from '../models/bills.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  public billSelected: BillOfBuyModel;

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Array<BillOfBuyModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.BILL_LIST_ENDPOINT}`).pipe();
  }

  save(element: BillOfBuyModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.BILL_SAVE_ENDPOINT}`, element).pipe();
  }

  reverse(element: ReverseBillOfBuyModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.BILL_REVERSE_ENDPOINT}`, element).pipe();
  }

  delete(element: BillOfBuyModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.BILL_DELETE_ENDPOINT}`, element).pipe();
  }

  download(id: number) {
    return this.httpClient.get(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.BILL_DOWNLOAD_ENDPOINT}${id}`, { responseType: 'blob' as 'json' });
  }
}
