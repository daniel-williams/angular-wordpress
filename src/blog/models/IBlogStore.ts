export interface IBlogStore {
    postMap?: any,
    widgets: Array<any>,
    postCount: number,
    pageCount: number,
    postsPerPage: number,
    currentPage: number,
    
    isUpdating: boolean,
    needSummaries: boolean,
    needWidgets: boolean,
    date?: Date,
    error?: any,
}