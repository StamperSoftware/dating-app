import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './floating-input.html',
  styleUrl: './floating-input.css'
})
export class FloatingInput implements ControlValueAccessor {
  
    label = input<string>('');
    type = input<string>('text');
    name = input<string>('');
    maxDate = input<string>("");
    
    constructor (@Self() public ngControl :NgControl) {
      this.ngControl.valueAccessor = this;
    }
    
    writeValue(obj: any): void {
    }
  
    registerOnChange(fn: any): void {
    }
  
    registerOnTouched(fn: any): void {
    }
  
    setDisabledState?(isDisabled: boolean): void {
    }

    get control(){
      return this.ngControl.control as FormControl
    }
}
