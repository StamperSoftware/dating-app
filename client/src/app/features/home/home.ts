import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Register } from "../account/register/register";

@Component({
  selector: 'app-home',
    imports: [
        Register,
    ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  
  protected registerMode = signal(false);

  showRegister(shouldShow:boolean){
    this.registerMode.set(shouldShow);
  }
}
