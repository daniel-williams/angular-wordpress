import {IBlogArticle} from './IBlogArticle';

export interface IBlogState{
    isUpdating: boolean,
    date?: Date,
    error?: any,
    totalPostCount: number,
    itemsPerPage: number,
    totalPages: number,
    activePage: number,
    posts: Array<IBlogArticle>,
}