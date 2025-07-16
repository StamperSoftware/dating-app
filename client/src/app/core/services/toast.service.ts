import { inject, Injectable } from '@angular/core';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  private container!:HTMLDivElement;
  private router = inject(Router);
  
  constructor() { 
    this.createToastContainer();
  }
  
  private createToastContainer(){
    if (!this.container){
      this.container = document.createElement('div');
      this.container.id = 'toast-container'
      this.container.className = 'toast toast-bottom toast-end'
      document.body.appendChild(this.container);
    }
  }
  
  private createToastElements(message:string, alertClass:string, duration=5000, avatar?:string, route?:string){
    
    if (!this.container) return;
    
    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg', 'flex', 'items-center', 'gap-3', 'cursor-pointer');
    
    if (route) {
      toast.addEventListener('click', () => this.router.navigateByUrl(route));
    }
    
    toast.innerHTML = `
<img src="${avatar || '/user.png'}" class='w-10 h-10 rounded'/>
<span class="self-center ">${message}</span>
<button class="btn btn-sm btn-ghost self-center justify-self-end">x</button>
    `;
    
    toast.querySelector('button')?.addEventListener('click', ()=> {
      this.container.removeChild(toast);
    })
    this.container.append(toast);
    
    setTimeout(()=>{
      if(this.container.contains(toast)){
        this.container.removeChild(toast);
      }
    }, duration);
  }
    
  success(message:string,duration?:number, avatar?:string, route?:string){
    this.createToastElements(message,'alert-success', duration, avatar, route);
  }
  
  warning(message:string,duration?:number, avatar?:string, route?:string){
    this.createToastElements(message,'alert-warning', duration, avatar, route);
  }
  
  info(message:string,duration?:number, avatar?:string, route?:string){
    this.createToastElements(message,'alert-info', duration, avatar, route);
  }
  
  error(message:string,duration?:number, avatar?:string, route?:string){
    this.createToastElements(message,'alert-error', duration, avatar, route);
  }
}
