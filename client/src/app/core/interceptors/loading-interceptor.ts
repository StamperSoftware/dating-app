import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { delay, finalize, of, tap } from "rxjs";

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  
  const loadingService = inject(LoadingService);
  
  const generateCacheKey = (url:string, params:HttpParams) => params.keys().reduce((prev, cur) => `${prev}&${cur}=${params.get(cur)}`, `${url}?`);
  
  const cacheKey = generateCacheKey(req.url, req.params);
  
  if (req.method === "GET"){
      const cachedResponse = cache.get(cacheKey);
      console.log(cachedResponse)
      //if (cachedResponse) return of(cachedResponse)
  }
  
  loadingService.loading();
  
  return next(req).pipe(
      delay(500),
      tap(resp => cache.set(cacheKey, resp)),
      finalize(()=>{loadingService.idle();}),
  )
};
