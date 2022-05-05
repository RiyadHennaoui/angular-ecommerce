import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private theEndpoint = environment.luv2shopApiUrl;
  private purchaseUrl = this.theEndpoint +'/checkout/purchase';
  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any> {

    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);

  }
}
