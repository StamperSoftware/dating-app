import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Member } from "../../models";

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private url = 'https://localhost:5001/api/members';
  
  getMember(id:string){
    return this.http.get<Member>(`${this.url}/${id}`);
  }
  getMembers(){
    return this.http.get<Member[]>(`${this.url}`);
  }
}
