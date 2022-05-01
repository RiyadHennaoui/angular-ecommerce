import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  countries: Country[] = [];
  contryCode: string;
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];




  constructor(private formBuilder: FormBuilder, private luv2ShopFormService: Luv2ShopFormService) { }

  ngOnInit(): void {

    this.luv2ShopFormService.getCountries().subscribe( data => {
      console.log("Retrieved Countries: " + JSON.stringify(data));
      this.countries = data;
    });


    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName:[''],
        lastName:[''],
        email:['']
      }),
      
      shippingAddress: this.formBuilder.group({
        country:[''],
        street:[''],
        city:[''],
        state:[''],
        zipCode:['']
      }), 
      
      billingAddress: this.formBuilder.group({
        country:[''],
        street:[''],
        city:[''],
        state:[''],
        zipCode:['']
      }),
     
      creditCard: this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:[''],
      })
    });


    const currentMonth: number = new Date().getMonth() + 1;

    this.luv2ShopFormService.getCreditCardMonth(currentMonth).subscribe(
      data => this.creditCardMonths = data 
    );

    this.luv2ShopFormService.getCreditCardYear().subscribe(
      data => this.creditCardYears = data
    ); 

  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code; 
    const countryName = formGroup.value.country.name;

    console.log(`{formGroupName} country code: ${countryCode} & name : ${countryName}`);
    

    this.luv2ShopFormService.getStates(countryCode).subscribe( data => {

      if(formGroupName === 'shippingAddress'){
        this.shippingAddressStates = data;
      }else{
        this.billingAddressStates = data;
      }
      formGroup.get('state').setValue(data[0]);
    });
  }

  onSubmit(){
    console.log("Handling the submit btn");
    console.log(this.checkoutFormGroup.get('customer').value);
  }

  copyShippingAddressToBillingAddress(event){

    if(event.target.checked){
      this.checkoutFormGroup.controls?.['billingAddress']
      .setValue(this.checkoutFormGroup.controls?.['shippingAddress'].value);
    }else{
      this.checkoutFormGroup.controls?.['billingAddress'].reset();
    }
  }

  handleMonthAndYear(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1; 
    }else{
      startMonth = 1;
    }
    
    this.luv2ShopFormService.getCreditCardMonth(startMonth).subscribe(
      data => this.creditCardMonths = data
    );

  }


}
