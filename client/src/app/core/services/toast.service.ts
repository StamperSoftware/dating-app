import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  private container!:HTMLDivElement;
  
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
  
  private createToastElements(message:string, alertClass:string, duration=5000){
    
    if (!this.container) return;
    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg');
    toast.innerHTML = `
  <span class="self-center ">${message}</span>
  <button class="btn btn-sm btn-ghost self-center justify-self-end ">x</button>
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
    
  success(message:string,duration?:number){
    this.createToastElements(message,'alert-success', duration);
  }
  warning(message:string,duration?:number){
    this.createToastElements(message,'alert-warning', duration);
  }
  info(message:string,duration?:number){
    this.createToastElements(message,'alert-info', duration);
  }
  error(message:string,duration?:number){
    this.createToastElements(message,'alert-error', duration);
  }
}
