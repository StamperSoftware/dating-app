import { Component, inject, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css'
})
export class TestErrors {
  
  private http = inject(HttpClient);
  url = `${environment.apiUrl}/errors`;
  accountsUrl = `${environment.apiUrl}/accounts`
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
    return this.http.post(`${this.accountsUrl}/register`, {}).subscribe({
      next:()=>{},
      error:(err) => {this.validationErrors.set(err) },
    })
  }
}
