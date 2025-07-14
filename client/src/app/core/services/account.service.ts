import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoginDto, RegisterDto, User } from "../../models";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { MemberLikesService } from "./member-likes.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/accounts`
  private memberLikesService = inject(MemberLikesService);
  
  currentUser = signal<User|null>(null);
  
  login(loginDto:LoginDto){
    return this.http
        .post<User>(`${this.url}/login`, loginDto)
        .pipe(
          tap((user) => this.setCurrentUser(user))
        );  
  }
  
  logout(){
    
    return this.http 
        .post(`${this.url}/logout`, {})
        .pipe(
            tap(() => {
              this.memberLikesService.clearLikeIds();
              localStorage.removeItem('filters');
              this.setCurrentUser(null);
            })
        );
  }
  
  register(registerDto:RegisterDto){
    return this.http.post<User>(`${this.url}/register`,registerDto).pipe(tap(user=>this.setCurrentUser(user)));
  } 
  
  setCurrentUser(user:User|null){
    if (!user) {
      localStorage.removeItem('user');
      this.currentUser.set(null);
      return;
    }
    
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUser.set(user);
    this.memberLikesService.getLikeIds();
  }  
}

