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
  private store$: Observable<models.IBlogStore>;
  private postMap$: Observable<any>;
  
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

    Observable
      .merge(summariesDispatcher, bodyDispatcher)
      .subscribe((action: Action) => appStore.dispatch(action));

    this.store$ = this.appStore.select(appStore => appStore.blog);
    this.postMap$ = this.store$
      .filter(store => !store.needSummaries)
      .map(store => store.postMap);
  }


  // public 
  loadSummaries(): void {
    if(this.appStore.value.blog.needSummaries) {
      this.dispatch$.next({type: actions.FETCH_SUMMARIES});
    }
  }
  
  getPosts(): Promise<models.IBlogPost[]> {
    return this.postMap$
      .map(postMap => Object.keys(postMap).map(slug => postMap[slug]))
      .take(1)
      .toPromise();
  }

  getRecentPosts(): Promise<models.IBlogPost[]> {
    return this.postMap$
      .map(postMap => Object.keys(postMap).map(slug => postMap[slug]).slice(0,5))
      .take(1)
      .toPromise();
  }

  getPost(slug: string): Promise<models.IBlogPost> {
    let post$ = this.postMap$
      .map(postMap => postMap[slug]);
    
    post$
      .filter(post => post.needBody && !post.isUpdating)
      .subscribe(post => this.loadBody(post));
    
    return post$.filter(post => !post.needBody).take(1).toPromise();
  }
  
  
  // private helpers
  loadBody(post: models.IBlogPost): void {
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
  
}