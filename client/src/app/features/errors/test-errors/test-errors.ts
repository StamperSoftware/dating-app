import { Component, inject, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css'
})
export class TestErrors {
  private http = inject(HttpClient);
  url = 'https://localhost:5001/api/errors'
  validationErrors = signal<string[]>([]);
  
  
  getNotFoundError(){
    return this.http.get(`${this.url}/not-found`).subscribe({
      next:()=>{},
      error:(err) => {},
    })
  }
  getUnauthorizedError(){
    return this.http.get(`${this.url}/unauthorized`).subscribe({
      next:()=>{},
      error:(err) => { },
    })
  }
  getBadRequestError(){
    return this.http.get(`${this.url}/bad-request`).subscribe({
      next:()=>{},
      error:(err) => {},
    })
  }
  getServerError(){
    return this.http.get(`${this.url}/server-error`).subscribe({
      next:()=>{},
      error:(err) => {},
    })
  }
  getValidationError(){
    return this.http.post(`https://localhost:5001/api/accounts/register`, {}).subscribe({
      next:()=>{},
      error:(err) => {this.validationErrors.set(err) },
    })
  }
}
