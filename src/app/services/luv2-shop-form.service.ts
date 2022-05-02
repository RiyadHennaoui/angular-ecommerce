import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = "http://localhost:8080/api/countries";
  private statesUrl = "http://localhost:8080/api/states";

  constructor(private httpClient: HttpClient) { }


  getCountries(): Observable<Country[]>{

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries )
    );

  } 

  getStates(countryCode: string): Observable<State[]>{

    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`

    console.log(`{getStates} url for API ! ${searchStatesUrl}`);
    

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states )
    );

  } 


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

interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}
