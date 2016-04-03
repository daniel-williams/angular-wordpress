import {Injectable, Inject} from 'angular2/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Action, Store} from '@ngrx/store';

import {IAppStore} from '../store';
import {BlogService} from './blog.service';
import {
  IBlogStore,
  IBlogSummary,
  IBlogBody,
  IBlogPost,
} from './models';
import * as actions from './blog.action';


@Injectable()
export class BlogActionCreators {
  
  private actions$ = new BehaviorSubject<Action>({type: null, payload: null});
  
  constructor(private appStore: Store<IAppStore>, private blogService: BlogService) {

    const fetchSummaries = this.actions$
      .filter(action => action.type === actions.FETCH_SUMMARIES)
      .do(() => appStore.dispatch({type: actions.FETCHING_SUMMARIES}))
      .mergeMap(
        action => blogService.fetchSummaries(),
        (action, json: any) => ({
          type: actions.FETCHED_SUMMARIES,
          payload: this.toSummariesPayload(json),
        })
      )

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
        (action, json: any) => ({
          type: actions.FETCHED_BODY,
          payload: {
            slug: action.payload.slug,
            body: this.toBodyPayload(json),
          }
        })
      );

    let fetchTags = this.actions$
      .filter(action => action.type === actions.FETCH_TAGS)
      .do(action => appStore.dispatch({type: actions.FETCHING_TAGS}))
      .mergeMap(
        action => blogService.fetchTags(),
        (action, json: any) => ({
          type: actions.FETCHED_TAGS,
          payload: {
            tags: this.toTagPayload(json.tags)
          }
        })
      );



    Observable
      .merge(fetchSummaries, fetchBody, fetchTags)
      .subscribe((action: Action) => appStore.dispatch(action));
  }

  loadSummaries() {
    if(this.appStore.value.blog.needSummaries) {
      this.actions$.next({type: actions.FETCH_SUMMARIES});
    }
  }
  
  loadBody(post: IBlogPost) {
    if(post && post.needBody) {
      this.actions$.next({
        type: actions.FETCH_BODY,
        payload: {
          id: post.id,
          slug: post.slug
        }
      });
    }
  }
  
  loadTags() {
    if(this.appStore.value.blog.needTags) {
      this.actions$.next({type: actions.FETCH_TAGS})
    }
  }
  
  
  private toSummariesPayload(json) {
    let postMap = json.posts.reduce((accum, item) => {
      accum[item.slug] = {
        id: item.id,
        title: item.title,
        slug: item.slug,
        date: new Date(item.date),
        summary: item.excerpt,
        needBody: true,
        isUpdating: false,
      };
      return accum;
    }, {});
    let postCount = json.count_total;
    let pageCount = Math.ceil(postCount / 5);
    
    return {
      postCount,
      pageCount,
      postMap,
    } 
  }
  private toBodyPayload(json) {
    let post = json.post;
    return {
      id: post.id,
      body: post.content,
    }
  }
  private toTagPayload(tags) {
    return tags.map(tag => ({
      id: tag.id,
      title: tag.title,
      slug: tag.slug,
      description: tag.description,
      count: tag.post_count,
    }));
  }
}