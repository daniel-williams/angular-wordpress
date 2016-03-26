import {provideStore} from '@ngrx/store';
import {LOGGING_PROVIDERS} from './logging';

import {BlogReducer, IBlogStore} from '../blog';


export interface IAppStore {
    blog?: IBlogStore,
}


export const STORE_PROVIDERS = [provideStore({blog:BlogReducer}), ...LOGGING_PROVIDERS];