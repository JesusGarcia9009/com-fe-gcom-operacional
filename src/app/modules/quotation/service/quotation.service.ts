import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { QuotationModel } from '../models/quotation.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  public quotationSelected: QuotationModel;

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Array<QuotationModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_LIST_ENDPOINT}`).pipe();
  }

  findById(id: number): Observable<QuotationModel> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_FIND_ID_ENDPOINT}${id}`).pipe();
  }

  save(quotation: QuotationModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_SAVE_ENDPOINT}`, quotation).pipe();
  }

  delete(element: QuotationModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_DELETE_ENDPOINT}`, element).pipe();
  }

  download(id: number) {
    return this.httpClient.get(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_DOWNLOAD_ENDPOINT}${id}`, { responseType: 'blob' as 'json' });
  }

  complete(code: string) {
    let params = new HttpParams();
    params = params.append("code", code);
    return this.httpClient.get<any>(
      `${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_COMPLETE_ENDPOINT}`, { params: params }
    ).pipe();
    // return this.opts.length ?
    //   of(this.opts) :
    //   this.http.get<any>('https://jsonplaceholder.typicode.com/users').pipe(tap(data => this.opts = data))
  }

}
