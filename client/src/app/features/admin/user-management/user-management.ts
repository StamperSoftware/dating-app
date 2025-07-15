import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AdminService } from "../../../core/services/admin.service";
import { User } from "../../../models";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-user-management',
  imports: [
    FaIconComponent
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  
  @ViewChild('rolesModal') rolesModal!:ElementRef<HTMLDialogElement>;
  
  private adminService = inject(AdminService);
  
  protected users = signal<User[]>([]);
  protected availableRoles = ['Member','Admin','Moderator'];
  protected selectedUser:User|null = null;

  ngOnInit(): void {
    this.getUsersWithRoles();
  }
  
  getUsersWithRoles(){
    this.adminService.getUsersWithRoles().subscribe({
      next:users => this.users.set(users),
    })
  }
  
  toggleRole(e:Event, role:string){
    if (!this.selectedUser) return;
    const isChecked = (e.target as HTMLInputElement).checked;
    
    if (isChecked) this.selectedUser.roles.push(role);
    else this.selectedUser.roles = this.selectedUser.roles.filter(r => r !== role);
  }
  
  updateUserRoles(){
   if (!this.selectedUser) return;
   this.adminService.updateUserRoles(this.selectedUser.id, this.selectedUser.roles).subscribe({
     next: (roles) => {
       this.users.update(users => users.map(u => {
         if (u.id === this.selectedUser?.id){
           u.roles = roles;
         }
         return u;
       }));
       this.rolesModal.nativeElement.close();
     },
   });
  }
  
  openRolesModal(user:User){
    this.selectedUser = user;
    this.rolesModal.nativeElement.showModal();
  }
  
  protected readonly faPencil = faPencil;
}
