import {Inject, Injectable} from 'angular2/core';
import {Router} from 'angular2/router';
import {Headers, Http, Request, RequestMethod} from 'angular2/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Action, Store} from '@ngrx/store';

import {FetchService} from '../fetch.service';
import {BlogResponseMapper} from './blog.response-mapper';
import {BLOG_CONFIG, IBlogConfig} from './blog.config';
import {IAppStore} from '../store';
import * as models from './models';
import * as actions from './blog.actions';


@Injectable()
export class BlogService extends FetchService {
  
  private API_ROOT: string;
  private blogStore$: Observable<models.IBlogStore>;
  private postMap$: Observable<any>;
  
  private actionDispatch$ = new BehaviorSubject<Action>({type: null, payload: null});
  
  postsPerPage: number;
  pageCount: number;
  currentPage: number = 1;
  
  constructor(
    protected http: Http,
    private router: Router,
    private appStore: Store<IAppStore>,
    private mapper: BlogResponseMapper,
    @Inject(BLOG_CONFIG) private blogConfig: IBlogConfig
  ) {
    super(http);
    
    this.API_ROOT = `http://${blogConfig.url}/api/`;

    this.blogStore$ = this.appStore
      .select(appStore => appStore.blog);

    this.blogStore$
      .subscribe(store => {
        this.postsPerPage = store.postsPerPage;
        this.pageCount = store.pageCount;
      });

    this.postMap$ = this.blogStore$
      .filter(store => !store.needSummaries)
      .map(store => store.postMap);

    this.subscribeToActions();
  }
  
  private subscribeToActions() {
    
    let fetchSummaries$ = this.actionDispatch$
      .filter(action => action.type === actions.FETCH_SUMMARIES)
      .do(() => this.appStore.dispatch({type: actions.FETCHING_SUMMARIES}))
      .mergeMap(
        action => this.fetchSummaries(),
        (action, json) => ({
          type: actions.FETCHED_SUMMARIES,
          payload: this.mapper.ResponseToPostMap(json),
        })
      )

    let fetchBody$ = this.actionDispatch$
      .filter(action => action.type === actions.FETCH_BODY)
      .do(action => this.appStore.dispatch({
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
            body: this.mapper.ResponseToBlogBody(json),
          }
        })
      );

    Observable
      .merge(fetchSummaries$, fetchBody$)
      .subscribe((action: Action) => this.appStore.dispatch(action));
  }


  // public 
  loadSummaries(): void {
    if(this.appStore.value.blog.needSummaries) {
      this.actionDispatch$.next({type: actions.FETCH_SUMMARIES});
    }
  }
  loadBody(post: models.IBlogPost): void {
    if(post && post.needBody) {
      this.actionDispatch$.next({
        type: actions.FETCH_BODY,
        payload: {
          id: post.id,
          slug: post.slug
        }
      });
    }
  }
  
  getPosts(): Observable<models.IBlogPost[]> {
    let start = this.currentPage * this.postsPerPage - this.postsPerPage;
    let end = start + this.postsPerPage;
    return this.postMap$
      .map(postMap => Object.keys(postMap).map(slug => postMap[slug]))
      .map(posts => posts.slice(start, end))
  }

  getRecentPosts(): Observable<models.IBlogPost[]> {
    return this.postMap$
      .map(postMap => Object.keys(postMap).map(slug => postMap[slug]).slice(0,5));
  }

  getPost(slug: string): Observable<models.IBlogPost> {
    let post$ = this.postMap$
      .map(postMap => postMap[slug]);
    
    post$
      .filter(post => post.needBody && !post.isUpdating)
      .subscribe(post => this.loadBody(post));
    
    return post$.filter(post => !post.needBody);
  }
  
  isFirstPage(): boolean {
    return this.currentPage === 1;
  }
  getPageStatus(): string {
    return this.pageCount > 0
      ? `${this.currentPage} of ${this.pageCount}`
      : '';
  }
  isLastPage(): boolean {
    return this.currentPage === this.pageCount || this.pageCount === 0;
  }
  
  onNext(event) {
    if(this.currentPage < this.pageCount) {
      this.router.navigate(['BlogPostList', {page: this.currentPage + 1}]);
    }
  }
  onPrevious(event) {
    if(this.currentPage > 2) {
      this.router.navigate(['BlogPostList', {page: this.currentPage - 1}]);
    } else if(this.currentPage === 2) {
      this.router.navigate(['BlogPostList']);
    }
  }
  
  setCurrentPage(page: number) {
    this.currentPage = page;
  }
  
  // private helpers
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
  
  private getSummariesUrl(): string {
    return `${this.API_ROOT}get_posts/?include=id,title,slug,date,excerpt&count=500`;
  }
  private getBodyUrl(id: number): string {
    return `${this.API_ROOT}get_post/?post_id=${id}&include=content`;
  }

}