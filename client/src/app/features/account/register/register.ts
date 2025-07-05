import { Component, inject, input, Input, output, Signal, signal } from '@angular/core';
import { RegisterDto } from "../../../models";
import { AccountService } from "../../../core/services/account.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-register',
  imports: [
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  protected creds = {} as RegisterDto;
  private accountService = inject(AccountService);
  handleCancel = output<boolean>();
    
  register(){
    this.accountService.register(this.creds).subscribe(() => this.handleCancel.emit(false));
  }
}
