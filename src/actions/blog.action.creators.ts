import {Injectable, Inject} from 'angular2/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Action, Store} from '@ngrx/store';

import {BlogService} from '../services/blog.service';
import {IAppStore, IBlogBody, IBlogStore} from '../interfaces';
import * as actions from './blog.action';


@Injectable()
export class BlogActionCreators {
  
  private actions$ = new BehaviorSubject<Action>({type: null, payload: null});
  
  constructor(private appStore: Store<IAppStore>, private blogService: BlogService) {

    let excepts = this.actions$
      .filter(action => action.type === actions.FETCH_EXCERPTS)
      .do(() => appStore.dispatch({type: actions.FETCHING_EXCERPTS}))
      .mergeMap(
        action => blogService.loadExcepts(),
        (action, payload: IBlogStore[]) => ({
          type: actions.FETCHED_EXCERPTS,
          payload: {
            date: new Date(),
            posts: payload
          }
        })
      );
        
    let body = this.actions$
      .filter(action => action.type === actions.FETCH_BODY)
      .do(() => appStore.dispatch({type: actions.FETCHING_BODY}))
      .mergeMap(
        action => blogService.loadBody(action.payload),
        (action, payload: IBlogBody) => ({
          type: actions.FETCHED_BODY,
          payload: payload
        })
      );

    Observable
      .merge(excepts, body)
      .subscribe((action: Action) => appStore.dispatch(action));
  }
  
  loadExcerptsAsNeeded() {
    if(this.appStore.value.blog.posts.length === 0) {
      this.actions$.next({type: actions.FETCH_EXCERPTS});
    }
  }
  loadBody(id) {
    let post = this.appStore.value.blog.posts.find(e=>e.id===id);
    if(!post) {
      console.log('TODO: deep link? load entire post');
      // this.actions$.next({type: actions.FETCH_POST, payload: id})
    } else if(!post.isLoaded) {
      this.actions$.next({type: actions.FETCH_BODY, payload: id})
    }
  }
}