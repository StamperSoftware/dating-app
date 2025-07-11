import { Component, inject, input, Input, OnInit, output, Signal, signal } from '@angular/core';
import { RegisterDto } from "../../../models";
import { AccountService } from "../../../core/services/account.service";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  
  private accountService = inject(AccountService);
  protected registerForm :FormGroup;
  
  handleCancel = output<boolean>();
  constructor () {
    this.registerForm = new FormGroup({
      email:new FormControl('', [Validators.required, Validators.email]),
      displayName:new FormControl('', [Validators.required]),
      password:new FormControl('', [Validators.required]),
      confirmPassword:new FormControl('', [Validators.required, this.compareValues('password')]),
    });
    
    this.registerForm.controls['password'].valueChanges.subscribe({
      next:()=>{this.registerForm.controls['confirmPassword'].updateValueAndValidity()}
    })
  }
  
  compareValues(controlField:string):ValidatorFn{
    
    return (control:AbstractControl) : (ValidationErrors|null) => {
      
      const parentFG = control.parent;
      if (!parentFG) return null;
      const match = parentFG.get(controlField)?.value;
      return control.value == match ? null : {passwordMismatch:true}; 
    }
  }
  
  register(){
    
    if (!this.registerForm.valid) return;
    
    const {password, confirmPassword} = this.registerForm.value;
    if (password !== confirmPassword) return;
    this.accountService.register(this.registerForm.value).subscribe(() => this.handleCancel.emit(false));
  }
}
