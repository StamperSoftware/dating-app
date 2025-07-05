import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MemberService } from "../../core/services/member.service";
import { Member } from "../../models";
import { Register } from "../account/register/register";
import { AccountService } from "../../core/services/account.service";

@Component({
  selector: 'app-home',
  imports: [
    Register
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  
  private memberService = inject(MemberService);
  private accountService = inject(AccountService);
  
  protected members:Member[] = [];
  protected registerMode = signal(false);

  currentUser = this.accountService.currentUser;
  
  ngOnInit () {
    this.memberService.getMembers().subscribe({next:(members)=>this.members=members})  
  }
  
  showRegister(shouldShow:boolean){
    this.registerMode.set(shouldShow);
  }
}
