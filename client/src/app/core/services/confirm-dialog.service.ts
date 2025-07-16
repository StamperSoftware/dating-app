import { Injectable } from '@angular/core';
import { ConfirmDialog } from "../../ui/confirm-dialog/confirm-dialog";

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  
    private dialogComponent? : ConfirmDialog;
    
    register(component:ConfirmDialog){
        this.dialogComponent = component;
    }
    
    confirm(message = "Are you sure?"):Promise<boolean>{
      if (!this.dialogComponent) throw new Error('dialog component not available');
      
      return this.dialogComponent.open(message);
    }
  
}

