import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  signInRequired : boolean;
  constructor(private router: Router){
    this.signInRequired = false;
    if(localStorage.getItem("Username")==null){
      this.signInRequired = true;
    }
    if(this.signInRequired){
      this.router.navigate(["/Login"]);
    }
    else{
      this.router.navigate(["/Home"]);
    }

  }

}
