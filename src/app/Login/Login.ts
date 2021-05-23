import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {User} from "./../User.model";
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  templateUrl: './Login.html',
  styleUrls: ['./Login.css']
})

export class LoginComponent {
  user : User;
  loggingIn: boolean;
  heading : string;
  notvalid : boolean;
  displayalert: boolean;
  notexists :boolean;
  passwordcheck : string;
  subheading: string;
  passwordsmatch : boolean;
  passworderror: boolean;

  //Initializing Components
  constructor(private router:Router){
    localStorage.clear();
    this.passwordsmatch = true;
    this.subheading = "";
    this.loggingIn=true;
    this.notexists = false;
    this.passworderror = false;
    this.notvalid = false;
    this.user = new User();
    this.heading="Login";
    this.subheading = "Welcome back";
    this.displayalert = false;
    this.passwordcheck = this.user.Password;
  }

  //Switching Between Loging and SingUp Attributes
  switchFields():void{
    this.notvalid = false;
    this.user = new User();
    if(this.loggingIn){
      this.loggingIn = false;
      this.heading = "SignUp";
      this.subheading = "We can't wait to have you with us";
      return;
    }
    this.loggingIn = true;
    this.heading = "Login";
    this.subheading = "Welcome back";
  }

   validatePasswords():void{
     if(this.user.Password.length<6){
       this.passworderror = true;
       return;
     }
     this.passworderror = false;
     if(this.passwordcheck.length==0){
      return;
    }
    //  console.log("Came Here !");
    if(this.passwordcheck!=this.user.Password){
      this.passwordsmatch = false;
      return;
    }
    this.passwordsmatch = true;
  }


  checkUsername(){
    var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regexp.test(this.user.Email);
  }

  //Logging In User !
  userLogin():void{
    this.user.Email.trim()
    console.log(this.checkUsername());
    if(!this.checkUsername()){
      this.notvalid = true;
      return;
    }
    if(localStorage.getItem("Username")==null || localStorage.getItem("Username")!=this.user.Email){
      this.notexists = true;
      return;
    }
    if(localStorage.getItem("Username")==this.user.Email && localStorage.getItem("Password")==this.user.Password){
      this.router.navigate(["/Home"]);
    }

  }

  userSignUp(): void{
    if(!this.passwordsmatch || this.user.Password.length<6){
      this.passworderror = true;
      return;
    }
    if(!this.checkUsername() || this.user.FirstName.length==0){
      this.notvalid = true;
      return;
    }
    this.notvalid = false;
    localStorage.setItem("FirstName",this.user.FirstName);
    localStorage.setItem("LastName",this.user.LastName);
    localStorage.setItem("Username",this.user.Email);
    localStorage.setItem("Password",this.user.Password);
    this.user = new User();
    this.loggingIn = true;
  }
}
  