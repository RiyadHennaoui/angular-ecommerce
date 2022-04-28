import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  searchMode: boolean;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword'); 

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }

  
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data; 
      }
    )
  }

  handleListProducts(){
  //check if "id" parameter is available
  const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

  if(hasCategoryId){

    // get the "id" param strng. convert string to number using the "+" symbol
    this.currentCategoryId = +this.route.snapshot.paramMap.get('id'); 
    console.log("dans le true");
  }else{
    console.log("dans le false");
    // not category id avaible ... default to category id 1
    this.currentCategoryId = 1;
  }
  this.productService.getProductList(this.currentCategoryId).subscribe(
    data => {
      this.products = data;
    }
  )
  }

}