import { CanActivateFn } from '@angular/router';
import { inject } from "@angular/core";
import { AccountService } from "../services/account.service";
import { ToastService } from "../services/toast.service";

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastService = inject(ToastService);
  
  if (accountService.currentUser()) return true;
  
  toastService.error("Not logged in");
  return false;
};
