import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  constructor() { }

  getCreditCardMonth(startMonth: number): Observable<number[]>{
    let data: number[] = [];

    for(let theMonth = startMonth; theMonth <= 12; theMonth++){

      data.push(theMonth);

    }

    return of(data); 

  }

  getCreditCardYear(): Observable<number[]>{

    let data: number[] = [];

    const thisYear: number = new Date().getFullYear();

    for(let year = thisYear; year <= thisYear + 10; year++){

      data.push(year);

    }

    return of(data);

  }
}
