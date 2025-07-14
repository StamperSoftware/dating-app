import { inject, Injectable } from '@angular/core';
import { AccountService } from "./account.service";
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  
  accountService = inject(AccountService);
  
  init(){
    const userString = localStorage.getItem('user');
    if (!userString) return of(null);
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
    
    return of(null)
    
  }
}
