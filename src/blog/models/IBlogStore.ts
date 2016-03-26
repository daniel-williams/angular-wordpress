export interface IBlogStore {
    postMap?: any,
    postCount: number,
    pageCount: number,
    postsPerPage: number,
    currentPage: number,
    
    isUpdating: boolean,
    needSummaries: boolean,
    date?: Date,
    error?: any,
}