import { Component, inject, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AccountService } from "../../core/services/account.service";
import { LoginDto } from "../../models";

@Component({
  selector: 'app-header',
  imports: [
    FormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  
  protected creds:LoginDto = { email:"",password:""}
  private accountService = inject(AccountService);
  protected currentUser = this.accountService.currentUser;
  
  login(){
    this.accountService.login(this.creds).subscribe();
  }
  
  logout(){
    this.creds = {email: "", password: ""}
    this.accountService.logout().subscribe();
  }
}
