import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    //whitespace validator
    static notOnlyWhiteSpace(control: FormControl) : ValidationErrors{
        
        
        //check if string only contains whitspace
        if((control.value != null) && (control.value.trim().length === 0)){
            //invalid, return error object

            return { 'notOnlyWithespace': true}
        }else{

            return null;
        }

        


    }

}
