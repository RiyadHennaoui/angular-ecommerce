import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string; 

  constructor(private oktaService: OktaAuthService) { }

  ngOnInit(): void {
    //Suscribe to authentication  changes
    this.oktaService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result; 
        this.getUserDetails();
      }
    )

    // this.oktaAuth.isAuthenticated().
  }
  getUserDetails() {
    if(this.isAuthenticated){
      // Fetch the logged in user details (user's)
      //
      // user full name is exposed as a property name
      this.oktaService.getUser().then(
        res => {
          this.userFullName = res.name;
        }
      )
    }
  }

  logout(){
    // Terminate the session with Okta and removes current  tokens. 
    this.oktaService.signOut(); 
  }

}
