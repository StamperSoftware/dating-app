import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UpdateMemberDto, Member } from '../../../../models';
import { DatePipe } from "@angular/common";
import { MemberService } from "../../../../core/services/member.service";
import { FormsModule, NgForm } from "@angular/forms";
import { AccountService } from "../../../../core/services/account.service";
import { DateAgoPipe } from "../../../../core/pipes/date-ago-pipe";

@Component({
  selector: 'app-member-profile',
    imports: [
        DatePipe,
        FormsModule,
        DateAgoPipe
    ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {
    
    @ViewChild('editForm') editForm?:NgForm;
    @HostListener('window:beforeunload', ['$event']) notify($event:BeforeUnloadEvent){
        if(this.editForm?.dirty){
            $event.preventDefault();
            
        }
    }
    
    private accountService = inject(AccountService);
    
    protected memberService = inject(MemberService);
    protected updateMemberDto:UpdateMemberDto = {
        displayName: '',
        description: '',
        city: '',
        country: '',
    }; 
    
    ngOnInit(): void {
        this.updateMemberDto = {
            displayName: this.memberService.member()?.displayName || '',
            description: this.memberService.member()?.description || '',
            city: this.memberService.member()?.city || '',
            country: this.memberService.member()?.country || '',
        }
    }
    
    updateProfile(){
        
        if (!this.memberService.member()) return;
        
        const updatedMember = {...this.memberService.member(), ...this.updateMemberDto};
        
        this.memberService.updateMember(this.updateMemberDto).subscribe({
            next:()=> {
                
                const currentUser = this.accountService.currentUser();
                if(currentUser && currentUser.displayName !== updatedMember.displayName) {
                    currentUser.displayName = updatedMember.displayName
                }
                this.memberService.member.set(updatedMember as Member);
                this.editForm?.reset(this.memberService.member());
                this.memberService.editMode.set(false);
            },
        });
    }
    
    
    ngOnDestroy () {
        if (this.memberService.editMode())
            this.memberService.editMode.set(false);
    }
}
