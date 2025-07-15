import { CanActivateFn } from '@angular/router';
import { inject } from "@angular/core";
import { AccountService } from "../services/account.service";
import { ToastService } from "../services/toast.service";

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastService = inject(ToastService);
  
  const user = accountService.currentUser();
  if (!user) return false;
  const { roles } = user;
  
  if (!(roles.includes('Admin') || roles.includes("Moderator"))){
    toastService.error("Forbidden");
    return false;
  }
  return true;
};
