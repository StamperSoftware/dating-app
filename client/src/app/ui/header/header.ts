import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AccountService } from "../../core/services/account.service";
import { LoginDto } from "../../models";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NgOptimizedImage } from "@angular/common";
import { ToastService } from "../../core/services/toast.service";
import { themes } from '../../shared/theme';
import { LoadingService } from "../../core/services/loading.service";

@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  
  
  private router = inject(Router);
  private toastService = inject(ToastService)
  
  protected creds:LoginDto = { email:"",password:""}
  protected accountService = inject(AccountService);
  protected currentUser = this.accountService.currentUser;
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || "dark");
  protected loadingService = inject(LoadingService);
  
  
  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme())
  }
  
  handleSelectedTheme(theme:string) {
    this.selectedTheme.set(theme);
    localStorage.setItem("theme",theme);
    document.documentElement.setAttribute("data-theme", theme);
    const elem = document.activeElement as HTMLDivElement;
    elem?.blur();
  }  
  
  login(){
    this.accountService.login(this.creds).subscribe({
      next:()=>{this.router.navigateByUrl('/');},
      error:(err)=>{this.toastService.error(err.error);},
    });
  }
  
  logout(){
    this.creds = {email: "", password: ""}
    this.accountService.logout().subscribe({
      next:()=>{this.router.navigateByUrl('/')},
      error:(err)=>{this.toastService.error(err.error);},
    });
  }

  protected readonly themes = themes;
}
