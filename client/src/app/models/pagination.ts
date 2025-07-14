export type PaginatedResults<T> = {
    items : T[]
    metadata : PaginationMetadata
}

export type PaginationParams = {
    pageIndex:number
    pageSize:number
}

export type PaginationMetadata = {
    pageIndex:number
    pageSize:number
    totalCount:number
}