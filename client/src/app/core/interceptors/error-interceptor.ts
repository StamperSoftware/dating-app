import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from "rxjs";
import { inject } from "@angular/core";
import { ToastService } from "../services/toast.service";
import { NavigationExtras, Router } from "@angular/router";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  
    const toastService = inject(ToastService);
    const router = inject(Router);
  
    return next(req).pipe(catchError(response => {
        if (response){
            switch(response.status) {
                case 400:
                    if (response.error.errors) {
                        const modelStateErrors = [];
                      
                        for (const key in response.error.errors){
                          const value = response.error.errors[key];
                          if (value){
                            modelStateErrors.push(value);
                          }
                        }
                        throw modelStateErrors.flat();
                    } else {
                      toastService.error(response.error)
                    }
                    break;
                case 401:
                    toastService.error("Unauthorized");
                    break;
                case 404:
                    toastService.error("Not Found");
                    router.navigateByUrl('not-found');
                    break;
                case 500:
                    const navigationExtras:NavigationExtras = {state:{error:response.error}};
                    router.navigateByUrl('server-error', navigationExtras);
                    break;
                default:
                    toastService.error(response.error);
                    break;
            }
        }
          
        throw response;
    }));
};
