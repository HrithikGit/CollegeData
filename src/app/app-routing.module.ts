import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Login/Login';
import {HomeComponent} from "./Home/Home";

const routes: Routes = [
  {path:'Login',component: LoginComponent},
  {path:'Home',component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const myroutes=[
  LoginComponent,
  HomeComponent
]