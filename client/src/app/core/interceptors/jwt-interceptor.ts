import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { AccountService } from "../services/account.service";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  
  const accountService = inject(AccountService);
  if (!accountService.currentUser()) return next(req);
  const newReq = req.clone({
    setHeaders:{
      Authorization: `Bearer ${accountService.currentUser()?.token}`
    }
  });
  
  return next(newReq);
};
