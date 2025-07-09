import { Component, inject } from '@angular/core';
import { MemberService } from "../../../core/services/member.service";
import { Observable } from 'rxjs';
import { Member } from "../../../models";
import { AsyncPipe } from "@angular/common";
import { MemberCard } from "./card/card";

@Component({
  selector: 'app-member-list',
    imports: [AsyncPipe, MemberCard],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class MemberList {
    private memberService = inject(MemberService)
    protected members$ : Observable<Member[]>;
    
    constructor () {
      this.members$ = this.memberService.getMembers();
    }
}
