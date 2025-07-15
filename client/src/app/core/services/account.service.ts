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
  interval:number = 0;
  
  login(loginDto:LoginDto){
    return this.http
        .post<User>(`${this.url}/login`, loginDto, {withCredentials:true})
        .pipe(
          tap((user) => {
              this.setCurrentUser(user);
              this.startTokenRefreshInterval();
          })
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
              clearInterval(this.interval);
            })
        );
  }

    register(registerDto:RegisterDto){
        return this.http.post<User>(`${this.url}/register`,registerDto, {withCredentials:true})
            .pipe(tap(user => {
                this.setCurrentUser(user);
                this.startTokenRefreshInterval();
            }));
    }
    
    private getRolesFromToken(user:User):string[]{
      const payload = user.token.split('.')[1];
      const decoded = atob(payload);
      const jsonPayload = JSON.parse(decoded);
    
      return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role];
    }
  
  refreshToken(){
      return this.http.post<User>(`${this.url}/refresh-token`, {}, {withCredentials:true})
  }
  
  startTokenRefreshInterval(){
      this.interval = setInterval(()=>{
        this.http.post<User>(`${this.url}/refresh-token`, {}, {withCredentials:true}).subscribe({
            next: (user) => this.setCurrentUser(user),
            error: ()=> this.logout(),
        })
      }, 5000 * 60)
  }

  
  setCurrentUser(user:User|null){
    if (!user) {
      this.currentUser.set(null);
      return;
    }
    
    user.roles = this.getRolesFromToken(user);
    this.currentUser.set(user);
    this.memberLikesService.getLikeIds();
  }  
    
  doesUserHaveRole(role:string){
      const user = this.currentUser();
      if (!user) return false;
      return user.roles.includes(role);
  }
  
}

