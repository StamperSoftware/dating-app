import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Register } from "../account/register/register";
import { AccountService } from "../../core/services/account.service";

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
  protected accountService = inject(AccountService);
  
  showRegister(shouldShow:boolean){
    this.registerMode.set(shouldShow);
  }
}
