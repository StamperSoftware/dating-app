export type PaginatedResults<T> = {
    items : T[]
    metadata : PaginationMetadata
}

export type PaginationParams = {
    currentPage:number
    pageSize:number
}

export type PaginationMetadata = {
    currentPage:number
    pageSize:number
    totalCount:number
}