import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Member, MemberLikesSearchParams, PaginatedResults } from '../../models';
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MemberLikesService {

    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/memberLikes`;
    likeIds = signal<string[]>([]);
    
    toggleLike(targetMemberId :string){
      return this.http.post(`${this.url}/${targetMemberId}`, {})
          .pipe(
            tap(() => this.likeIds().includes(targetMemberId) ? this.likeIds.update(ids => ids.filter(id => id !== targetMemberId)) : this.likeIds.update(ids => [...ids, targetMemberId]))
          );
    }
    
    getLikes(params:MemberLikesSearchParams, ){
        let httpParams = new HttpParams().appendAll({
            pageIndex: params.pageIndex,
            pageSize: params.pageSize,
            predicate:params.predicate
        });
        return this.http.get<PaginatedResults<Member>>(`${this.url}`, {params: httpParams})
    }
    
    getLikeIds(){
        return this.http.get<string[]>(`${this.url}/list`).subscribe({
          next : ids => this.likeIds.set(ids),
        });
    }
    
    clearLikeIds(){
        this.likeIds.set([]);
    }
    
}
