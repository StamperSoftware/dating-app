import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Member, Photo, UpdateMemberDto } from "../../models";
import { environment } from "../../../environments/environment";
import { AccountService } from "./account.service";
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/members`;
  editMode = signal(false);
  member = signal<Member|null>(null);  
  
  getMember(id:string){
    return this.http.get<Member>(`${this.url}/${id}`).pipe(tap(member => {this.member.set(member)}));
  }
  
  getMembers(){
    return this.http.get<Member[]>(`${this.url}`);
  }
  
  getPhotos(memberId:string){
    return this.http.get<Photo[]>(`${this.url}/${memberId}/photos`);
  }

  updateMember(updateMember:UpdateMemberDto){
    return this.http.put(`${this.url}`, updateMember);
  }
  
}
