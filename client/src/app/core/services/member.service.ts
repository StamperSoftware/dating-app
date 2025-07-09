import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Member, Photo } from "../../models";
import { environment } from "../../../environments/environment";
import { AccountService } from "./account.service";

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/members`;
  
  getMember(id:string){
    return this.http.get<Member>(`${this.url}/${id}`);
  }
  getMembers(){
    return this.http.get<Member[]>(`${this.url}`);
  }
  
  getPhotos(memberId:string){
    return this.http.get<Photo[]>(`${this.url}/${memberId}/photos`);
  }
  
}
