import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberLikesService } from "../../core/services/member-likes.service";
import { Member, PaginationMetadata, MemberSearchParams, MemberLikesSearchParams } from "../../models";
import { MemberCard } from "../members/list/card/card";
import { Paginator } from "../../ui/paginator/paginator";

@Component({
  selector: 'app-matches',
  imports: [
    MemberCard,
    Paginator
  ],
  templateUrl: './matches.html',
  styleUrl: './matches.css'
})
export class Matches implements OnInit {
  
    private memberLikesService = inject(MemberLikesService);
    protected members = signal<Member[]>([]);
    protected paginationMetadata = signal<PaginationMetadata | undefined>(undefined);
    protected memberLikesSearchParams = new MemberLikesSearchParams();
    
    tabs: {label:string, value:"liked"|"likedBy"|"mutual"}[] = [
      {label:'Liked Me', value:'likedBy'},
      {label:'Liked', value:'liked'},
      {label:'Mutual', value:'mutual'},
    ]
  
    ngOnInit(): void {
      this.getMemberLikes();
    }
  
    setPredicate(predicate:"liked"|"likedBy"|"mutual"){
      if (this.memberLikesSearchParams.predicate == predicate) return;
      this.memberLikesSearchParams.predicate = predicate;
      this.memberLikesSearchParams.pageIndex=0;
      this.getMemberLikes();
    }

    handlePageChange(event : {pageIndex:number, pageSize:number}){
      this.memberLikesSearchParams.pageIndex = event.pageIndex;
      this.memberLikesSearchParams.pageSize = event.pageSize;
      this.getMemberLikes();
    }
    
    getMemberLikes(){
      this.memberLikesService.getLikes(this.memberLikesSearchParams).subscribe({
        next:(response)=> { 
          this.members.set(response.items);
          this.paginationMetadata.set(response.metadata);
        }
      })
    }
}
