import {Injectable, Inject} from 'angular2/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Action, Store} from '@ngrx/store';

import {BlogService} from '../services/blog.service';
import {IAppState, IBlogState} from '../interfaces';
import * as actions from './blog.action';


@Injectable()
export class BlogActionCreators {
  
  private actions$ = new BehaviorSubject<Action>({type: null, payload: null});
  
  constructor(private store: Store<IAppState>, private blogService: BlogService) {

    let excepts = this.actions$
      .filter(action => action.type === actions.FETCH_EXCERPTS)
      .do(() => store.dispatch({type: actions.FETCHING_EXCERPTS}))
      .mergeMap(action => blogService.loadExcepts(),
        (action, payload: IBlogState[]) => ({type: actions.FETCHED_EXCERPTS, payload: {
          date: new Date(),
          posts: payload
        }}));

    Observable
      .merge(excepts)
      .subscribe((action: Action) => store.dispatch(action));
  }
  
  loadExcerpts() {
    this.actions$.next({type: actions.FETCH_EXCERPTS});
  }
}