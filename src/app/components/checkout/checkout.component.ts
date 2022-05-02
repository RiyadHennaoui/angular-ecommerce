import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

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
  // contryCode: string;
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];




  constructor(private formBuilder: FormBuilder, private luv2ShopFormService: Luv2ShopFormService, private cartService: CartService) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.luv2ShopFormService.getCountries().subscribe( data => {
      console.log("Retrieved Countries: " + JSON.stringify(data));
      this.countries = data;
    });


    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        lastName:new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        email:new FormControl('',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+\\.[a-z]{2,4}$')])
      }),
      
      shippingAddress: this.formBuilder.group({
        country:new FormControl('',[Validators.required]),
        street:new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        city:new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace])
      }), 
      
      billingAddress: this.formBuilder.group({
        country:new FormControl('',[Validators.required]),
        street:new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        city:new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace])
      }),
     
      creditCard: this.formBuilder.group({
        cardType:new FormControl('',[Validators.required]),
        nameOnCard:new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber:new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode:new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}')]),
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
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
   }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code; 
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode} & name : ${countryName}`);
    

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
    console.log("the shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("the shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);

    if( this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    
  }

  copyShippingAddressToBillingAddress(event){

    if(event.target.checked){
      this.checkoutFormGroup.controls?.['billingAddress']
      .setValue(this.checkoutFormGroup.controls?.['shippingAddress'].value);
      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls?.['billingAddress'].reset();

      //bug fix for states
      this.billingAddressStates = [];
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

  //getters for cutomer
  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

    //getters for shippingAddress
    get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
    get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
    get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
    get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');} 
    get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
    //getters for billingAddress
    get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
    get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
    get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}
    get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode');} 
    get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}

     //getters for credit card
     get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
     get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
     get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
     get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');} 
     

 
}
