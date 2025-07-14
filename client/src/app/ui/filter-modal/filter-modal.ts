import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { MemberSearchParams } from "../../models";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-filter-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css'
})
export class FilterModal {

  @ViewChild('filterModal') modalRef!:ElementRef<HTMLDialogElement>;
  closeModal = output();
  submitData = output<MemberSearchParams>();
  memberParams = input(new MemberSearchParams(0, 5));
  
  open(){
    this.modalRef.nativeElement.showModal();
  }
  
  close(){
    this.modalRef.nativeElement.close();
    //this.closeModal.emit()
  }
  
  submit(){
    this.submitData.emit(this.memberParams());
    this.close();
  }
  
  onMinAgeChange(){
    if (this.memberParams().minAge < 18) this.memberParams().minAge = 18;
    if (this.memberParams().minAge > this.memberParams().maxAge) this.memberParams().minAge = this.memberParams().maxAge-1;
  }
  
  onMaxAgeChange(){
    if (this.memberParams().maxAge < this.memberParams().minAge) this.memberParams().maxAge = this.memberParams().minAge+1;
  }
}
