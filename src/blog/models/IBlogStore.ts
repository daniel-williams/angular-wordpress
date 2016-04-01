import {ITag} from './ITag';

export interface IBlogStore {
    postMap?: any,
    postCount: number,
    pageCount: number,
    postsPerPage: number,
    currentPage: number,
    
    tags?: Array<ITag>,
    
    isUpdating: boolean,
    needSummaries: boolean,
    needTags: boolean,
    date?: Date,
    error?: any,
}