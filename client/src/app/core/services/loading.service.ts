import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  requestCount = signal(0);
  
  loading(){
    this.requestCount.update(cur => cur+1);
  }
  
  idle(){
    this.requestCount.update(cur => Math.max(0, cur-1));
  }
  
  
  
}
