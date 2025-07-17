import { inject, Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Photo, User } from "../../models";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private url = `${environment.apiUrl}/admin`;
  private http = inject(HttpClient);
  
  
  getUsersWithRoles(){
    return this.http.get<User[]>(`${this.url}/users-with-roles`);
  }
  
  updateUserRoles(userId:string, roles:string[]){
    return this.http.post<string[]>(`${this.url}/roles/${userId}?roles=${roles.join(",")}`, {})
  }
 
  getUnapprovedPhotos(){
    return this.http.get<Photo[]>(`${this.url}/photos-to-moderate`);
  }
  
  approvePhoto(photoId:number){
    return this.http.post(`${this.url}/approve-photo`,{}, {params : {photoId}});
  }
  
  rejectPhoto(photoId:number){
    return this.http.post(`${this.url}/reject-photo`,{}, {params : {photoId}});
  }
  
}
