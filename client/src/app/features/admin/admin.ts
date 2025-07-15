import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from "../../core/services/account.service";
import { PhotoManagement } from "./photo-management/photo-management";
import { UserManagement } from "./user-management/user-management";

@Component({
  selector: 'app-admin',
  imports: [
    PhotoManagement,
    UserManagement
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit{
  
  protected accountService = inject(AccountService);
  
  tabs = [
    {label:"Photo Moderation", value:"photos"},
    {label:"User Management", value:"users"},
  ]
  
  activeTab = 'photos';
  
  ngOnInit(): void {
   console.log(this.accountService.currentUser()?.roles) 
  }

  setTab(tab:string){
    this.activeTab = tab;
  }

}
