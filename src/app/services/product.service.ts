import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  
  
  private theEndpoint = environment.luv2shopApiUrl;
  private baseUrl = this.theEndpoint + '/products';
  private categoryUrl = this.theEndpoint + '/product-category'

  constructor(private httpClient: HttpClient) { }

  
  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProduct> {

    // need to build URL based on category id 
      const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`;
      console.log(searchUrl);
    return this.httpClient.get<GetResponseProduct>(searchUrl);
    
  }



  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on category id 
      const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
      console.log(searchUrl);
    return this.getProducts(searchUrl);
    
  }

  getProductCategories(): Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );

  }


  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);

  }

  searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProduct> {

    // need to build URL based on category id 
      const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                      + `&page=${thePage}&size=${thePageSize}`;
      console.log(searchUrl);
    return this.httpClient.get<GetResponseProduct>(searchUrl);
    
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number): Observable<Product>{

    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);

  }
}



interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}


interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
