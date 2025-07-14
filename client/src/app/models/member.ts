import { Gender } from "./gender";

export type Member = {
    id:string
    displayName:string
    dateOfBirth:string
    imageUrl?:string
    created:string
    lastActive:string
    gender:string
    description?:string
    country:string
    city:string
}

export class MemberSearchParams {
    
    constructor (pageIndex:number, pageSize:number, gender?:Gender) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.gender = gender;
        this.orderBy = "displayName";
    }
    
    gender?: Gender
    minAge = 18
    maxAge = 100
    pageIndex = 0;
    pageSize = 10;
    orderBy = "";
}

export class MemberLikesSearchParams {
    pageIndex = 0;
    pageSize = 10;
    predicate:"liked"|"likedBy"|"mutual" = "likedBy";
}