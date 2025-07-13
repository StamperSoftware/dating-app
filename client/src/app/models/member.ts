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
    
    constructor (currentPage:number, pageSize:number, name:string = "", gender?:Gender) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.name = name;
        this.gender = gender;
        this.orderBy = "displayName"
    }
    
    gender?: Gender
    minAge = 18
    maxAge = 100
    currentPage = 0;
    pageSize = 10;
    name = "";
    orderBy = "";
}
