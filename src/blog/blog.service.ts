import {Inject, Injectable} from 'angular2/core';
import {Headers, Http, Request, RequestMethod, Response} from 'angular2/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Action, Store} from '@ngrx/store';

import {BLOG_CONFIG, IBlogConfig} from './blog.config';
import {IAppStore} from '../store';
import * as models from './models';
import * as actions from './blog.action';


@Injectable()
export class BlogService {
  
  private API_ROOT: string;
  private dispatch$ = new BehaviorSubject<Action>({type: null, payload: null});
  
  constructor(
    private http: Http,
    private appStore: Store<IAppStore>,
    @Inject(BLOG_CONFIG) blogConfig: IBlogConfig
  ) {
    this.API_ROOT = `http://${blogConfig.url}/api/`;
    
    const summariesDispatcher = this.dispatch$
      .filter(action => action.type === actions.FETCH_SUMMARIES)
      .do(() => appStore.dispatch({type: actions.FETCHING_SUMMARIES}))
      .mergeMap(
        action => this.fetchSummaries(),
        (action, json: any) => ({
          type: actions.FETCHED_SUMMARIES,
          payload: this.toSummariesPayload(json),
        })
      )

    const bodyDispatcher = this.dispatch$
      .filter(action => action.type === actions.FETCH_BODY)
      .do(action => appStore.dispatch({
        type: actions.FETCHING_BODY,
        payload: {
          slug: action.payload.slug
        }
      }))
      .mergeMap(
        action => this.fetchBody(action.payload.id),
        (action, json: any) => ({
          type: actions.FETCHED_BODY,
          payload: {
            slug: action.payload.slug,
            body: this.toBodyPayload(json),
          }
        })
      );

    const tagsDispatcher = this.dispatch$
      .filter(action => action.type === actions.FETCH_TAGS)
      .do(action => appStore.dispatch({type: actions.FETCHING_TAGS}))
      .mergeMap(
        action => this.fetchTags(),
        (action, json: any) => ({
          type: actions.FETCHED_TAGS,
          payload: {
            tags: this.toTagPayload(json.tags)
          }
        })
      );

    Observable
      .merge(summariesDispatcher, bodyDispatcher, tagsDispatcher)
      .subscribe((action: Action) => appStore.dispatch(action));
  }


  // public 
  loadSummaries() {
    if(this.appStore.value.blog.needSummaries) {
      this.dispatch$.next({type: actions.FETCH_SUMMARIES});
    }
  }
  loadBody(post: models.IBlogPost) {
    if(post && post.needBody) {
      this.dispatch$.next({
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
      this.dispatch$.next({type: actions.FETCH_TAGS})
    }
  }
  
  
  private fetchSummaries(): Observable<models.IBlogSummary[]> {
    return this.request({
      method: RequestMethod.Get,
      url: this.getSummariesUrl()
    });
  }
  
  private fetchBody(id: number): Observable<models.IBlogBody> {
    return this.request({
      method: RequestMethod.Get,
      url: this.getBodyUrl(id)
    });
  }
  
  private fetchTags(): Observable<models.ITag> {
    return this.request({
      method: RequestMethod.Get,
      url: this.getTags()
    });
  }
  
  
  // private helpers
  private request(options: any): Observable<any> {
    if (options.body) {
      if (typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
      }

      options.headers = new Headers({
        'Content-Type': 'application/json'
      });
    }

    return this.http
      .request(new Request(options))
      .map(res => res.json());
  }
  
  private getPostsEndpoint(q: string) : string {
    return `${this.API_ROOT}get_posts/?${q}`;
  }
  private getPostEndpoint(id: number, q: string): string {
    return `${this.API_ROOT}get_post/?post_id=${id}&${q}`;
  }
  private getSummariesUrl(): string {
    return this.getPostsEndpoint('include=id,title,slug,date,excerpt&count=500');
  }
  private getBodyUrl(id: number): string {
    return this.getPostEndpoint(id, 'include=content');
  }
  private getTags(): string {
    return `${this.API_ROOT}get_tag_index/`;
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