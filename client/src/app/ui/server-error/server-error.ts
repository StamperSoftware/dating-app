import { Component, inject, signal } from '@angular/core';
import { Router } from "@angular/router";
import { ApiError } from "../../models";

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css'
})
export class ServerError {
  
    private router = inject(Router);
    protected error:ApiError;
    protected showDetails = false;
    
    constructor () {
        const navigation = this.router.getCurrentNavigation();
        this.error = navigation?.extras?.state?.['error'];
    }
    
    toggleShowDetails(){
      this.showDetails = !this.showDetails;
    }
}
