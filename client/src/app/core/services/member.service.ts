import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Member, PaginatedResults, PaginationParams, Photo, UpdateMemberDto } from "../../models";
import { environment } from "../../../environments/environment";
import { tap } from 'rxjs';
import { MemberSearchParams } from "../../models/member";

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/members`;
  editMode = signal(false);
  member = signal<Member|null>(null);  
  
  getMember(id:string){
    
    return this.http.get<Member>(`${this.url}/${id}`)
        .pipe(
            tap(member => {this.member.set(member)})
        );
  }
  
  getMembers(memberSearchParams:MemberSearchParams){
    
    let params = new HttpParams().appendAll({
      pageIndex: memberSearchParams.currentPage,
      pageSize: memberSearchParams.pageSize,
      name: memberSearchParams.name,
      minAge: memberSearchParams.minAge,
      maxAge:memberSearchParams.maxAge,
      orderBy:memberSearchParams.orderBy,
    });
    
    if (memberSearchParams.gender) params = params.append('gender', memberSearchParams.gender )
    
    return this.http.get<PaginatedResults<Member>>(`${this.url}`, {params}).pipe(
        tap(()=> {
          localStorage.setItem('filters', JSON.stringify(memberSearchParams));
        })
    );
  }

  updateMember(updateMember:UpdateMemberDto){
    return this.http.put(`${this.url}`, updateMember);
  }
  
  getPhotos(memberId:string){
    return this.http.get<Photo[]>(`${this.url}/${memberId}/photos`);
  }
  
  uploadPhoto(memberId:string, file:File){
    
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<Photo>(`${this.url}/${memberId}/photos`, formData);
  }
  
  setMainPhoto(memberId:string, photoId:string){
    return this.http.put(`${this.url}/${memberId}/photos/main/${photoId}`, {});
  }
  
  deletePhoto(memberId:string, photoId:string){
    return this.http.delete(`${this.url}/${memberId}/photos/${photoId}`);
  }
  
}
