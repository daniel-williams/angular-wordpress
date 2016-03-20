import {provideStore} from '@ngrx/store';
import {LOGGING_PROVIDERS} from './logging';

import {
  blog,
} from '../reducers';

export const STORE_PROVIDERS = [provideStore({blog}), ...LOGGING_PROVIDERS];