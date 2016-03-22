import {Injectable, Inject} from 'angular2/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Action, Store} from '@ngrx/store';

import {BlogService} from '../services/blog.service';
import {IAppStore} from '../interfaces/IAppStore';
import {
  IBlogStore,
  IBlogTitle,
  IBlogSummary,
  IBlogBody,
  IBlogPost,
} from '../interfaces/IBlogStore';
import * as actions from './blog.action';


@Injectable()
export class BlogActionCreators {
  
  private actions$ = new BehaviorSubject<Action>({type: null, payload: null});
  
  constructor(private appStore: Store<IAppStore>, private blogService: BlogService) {

    const fetchTitles = this.actions$
      .filter(action => action.type === actions.FETCH_TITLES)
      .do(() => appStore.dispatch({type: actions.FETCHING_TITLES}))
      .mergeMap(
        action => blogService.fetchTitles(),
        (action, blogTitles: IBlogTitle[]) => ({
          type: actions.FETCHED_TITLES,
          payload: {
            postMap: this.blogTitlesToPostMap(blogTitles),
          }
        })
      )

    let fetchSummary = this.actions$
      .filter(action => action.type === actions.FETCH_SUMMARY)
      .do(action => appStore.dispatch({
        type: actions.FETCHING_SUMMARY,
        payload: {
          slug: action.payload.slug,
        }
      }))
      .mergeMap(
        action => blogService.fetchSummary(action.payload.id),
        (action, blogSummary: IBlogSummary) => ({
          type: actions.FETCHED_SUMMARY,
          payload: {
            slug: action.payload.slug,
            summary: blogSummary,
          }
        })
      );

    let fetchBody = this.actions$
      .filter(action => action.type === actions.FETCH_BODY)
      .do(action => appStore.dispatch({
        type: actions.FETCHING_BODY,
        payload: {
          slug: action.payload.slug
        }
      }))
      .mergeMap(
        action => blogService.fetchBody(action.payload.id),
        (action, blogBody: IBlogBody) => ({
          type: actions.FETCHED_BODY,
          payload: {
            slug: action.payload.slug,
            body: blogBody,
          }
        })
      );

    Observable
      .merge(fetchTitles, fetchSummary, fetchBody)
      .subscribe((action: Action) => appStore.dispatch(action));
  }

  loadTitles() {
    if(this.appStore.value.blog.needTitles) {
      this.actions$.next({type: actions.FETCH_TITLES});
    }
  }
  
  loadSummary(slug: string) {
    const post = <IBlogPost>this.appStore.value.blog.postMap[slug];
    if(post && post.needSummary) {
      this.actions$.next({
        type: actions.FETCH_SUMMARY,
        payload: {
          id: post.id,
          slug: slug
        }
      });
    }
  }
  
  loadBody(slug: string) {
    const post = <IBlogPost>this.appStore.value.blog.postMap[slug];
    if(post && post.needBody) {
      this.actions$.next({
        type: actions.FETCH_BODY,
        payload: {
          id: post.id,
          slug: slug
        }
      });
    }
  }
  
  
  private blogTitlesToPostMap(blogTitles) {
    return blogTitles.reduce((accum, item) => {
      accum[item.slug] = {
        id: item.id,
        title: item.title,
        slug: item.slug,
        date: new Date(item.date),
        needSummary: true,
        needBody: true,
        isUpdating: false,
      };
      return accum;
    }, {});
  }
}