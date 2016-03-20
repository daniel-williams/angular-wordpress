import {IBlogPost} from './IBlogPost';

export interface IBlogStore{
    isUpdating: boolean,
    date?: Date,
    error?: any,
    totalPostCount: number,
    itemsPerPage: number,
    totalPages: number,
    activePage: number,
    posts: Array<IBlogPost>,
}