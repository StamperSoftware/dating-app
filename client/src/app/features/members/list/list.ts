import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from "../../../core/services/member.service";
import { Member, PaginationMetadata, MemberSearchParams } from "../../../models";
import { MemberCard } from "./card/card";
import { Paginator } from "../../../ui/paginator/paginator";
import { FilterModal } from "../../../ui/filter-modal/filter-modal";
import { LoadingService } from "../../../core/services/loading.service";

@Component({
  selector: 'app-member-list',
    imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class MemberList implements OnInit {
    
    @ViewChild('filterModal') filterModal!:FilterModal;
    
    private memberService = inject(MemberService)
    
    protected loadingService = inject(LoadingService);
    protected members = signal<Member[]>([]);
    protected paginationMetadata = signal<PaginationMetadata | undefined>(undefined);
    protected memberSearchParams:MemberSearchParams;
    protected memberTextSearchParams:MemberSearchParams;
    
    constructor () {
        const filters = localStorage.getItem('filters');
        this.memberSearchParams = filters ? JSON.parse(filters) : new MemberSearchParams(0,5);
        this.memberTextSearchParams = {...this.memberSearchParams};
    }
    
    ngOnInit(): void {
        this.getMembers();
    }
    
    handlePageChange(event : {pageIndex:number, pageSize:number}){
        this.memberSearchParams.pageIndex = event.pageIndex;
        this.memberSearchParams.pageSize = event.pageSize;
        this.memberTextSearchParams = {...this.memberSearchParams};
        this.getMembers();
    }
    
    getMembers(){
        this.memberService.getMembers(this.memberSearchParams).subscribe({
            next : (result) => {
                console.log(result);
                this.members.set(result.items);
                this.paginationMetadata.set(result.metadata);
            },
        });
    }
    
    openModal(){
        this.filterModal.open();
    }
    
    closeModal(){
        this.filterModal.close();
    }
    
    handleFilterChange(data:MemberSearchParams){
        this.memberSearchParams = data;
        this.memberTextSearchParams = {...this.memberSearchParams};
        this.getMembers();
    }
    
    resetFilter(){
        this.memberSearchParams = new MemberSearchParams(0,5);
        this.memberTextSearchParams = {...this.memberSearchParams};
        this.getMembers();
    }
    
    get displayMessage() :string {
        
        const filters:string[] = [];
        
        if (this.memberSearchParams.gender){
           filters.push(`${this.memberSearchParams.gender}s`) 
        } else {
           filters.push(`Males/Females`) 
        }
        
        filters.push(`Age: ${this.memberSearchParams.minAge} - ${this.memberSearchParams.maxAge}`);
        let orderBy = ""
        
        switch (this.memberSearchParams.orderBy) {
            case "displayName":
                orderBy = "Name";
                break;
                
            case "lastActive":
                orderBy = "Recently Active";
                break;
                
            case "created":
                orderBy = "Newest Members";
                break;
            default:
                orderBy = "Name";
        }
        
        filters.push(`Ordered By: ${orderBy}`);
        return `Selected: ${filters.join(" | ")}`;
    }
}
