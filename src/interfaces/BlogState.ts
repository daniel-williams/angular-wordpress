import {BlogArticle} from './BlogArticle';

export interface BlogState{
    isUpdating: boolean,
    date?: Date,
    error?: any,
    totalPostCount: number,
    itemsPerPage: number,
    totalPages: number,
    activePage: number,
    posts: Array<BlogArticle>,
}