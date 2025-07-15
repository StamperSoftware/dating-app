import { inject, Injectable } from '@angular/core';
import { AccountService } from "./account.service";
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  
  accountService = inject(AccountService);
  
  init(){
    
    return this.accountService.refreshToken().pipe(
        tap(user => {
          if (user) {
            this.accountService.setCurrentUser(user);
            this.accountService.startTokenRefreshInterval();
          }
        })
    )
  }
}
