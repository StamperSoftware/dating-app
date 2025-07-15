import { Component, Inject, inject, input, Input, OnInit, output, Signal, signal } from '@angular/core';
import { RegisterDto } from "../../../models";
import { AccountService } from "../../../core/services/account.service";
import {
  AbstractControl, FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { FloatingInput } from "../../../ui/floating-input/floating-input";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FloatingInput
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  protected registerForm :FormGroup;
  protected profileForm : FormGroup;
  protected currentStep = signal(0);
  protected validationErrors = signal<string[]>([]);
  
  
  handleCancel = output<boolean>();
  
  constructor () {
    
    this.registerForm = this.fb.group({ 
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.compareValues('password')]],
    });
    
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: ()=> {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity()
      }
    });
    
    this.profileForm = this.fb.group({
      gender:['', [Validators.required]],
      city:['', [Validators.required]],
      country:['', [Validators.required]],
      dateOfBirth:['', [Validators.required]],
    });
  }
  
  updateCurrentStep(nextStep:1|-1){
    
    if (nextStep === -1 && this.currentStep() == 0) return;
    if (nextStep === 1 && this.currentStep() == 1) {
      this.register();
      return;
    }
    
    this.currentStep.update(step => step + nextStep)
  }
  
  compareValues(controlField:string):ValidatorFn{
    
    return (control:AbstractControl) : (ValidationErrors|null) => {
      
      const parentFG = control.parent;
      if (!parentFG) return null;
      const match = parentFG.get(controlField)?.value;
      return control.value == match ? null : {passwordMismatch:true}; 
    }
  }
  
  getMaxDate(){
    const today = new Date();
    today.setFullYear(today.getFullYear()-18);
    return today.toISOString().split('T')[0]
  }
  
  register(){
    if (!this.registerForm.valid || !this.profileForm.valid) return;
    const formData = {...this.registerForm.value, ...this.profileForm.value};
    this.accountService.register(formData).subscribe({
      next : ()=> {
        this.handleCancel.emit(false);
        this.router.navigateByUrl('/members');
      },
      error : err => this.validationErrors.set(err),
    });
  }
}
