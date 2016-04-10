import {Inject, Injectable} from 'angular2/core';
import {Http, RequestMethod} from 'angular2/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Action, Store} from '@ngrx/store';

import {FetchService} from '../fetch.service';
import {TagServiceMapper} from './tag.service-mapper.ts';
import {BLOG_CONFIG, IBlogConfig} from './blog.config';
import {IAppStore} from '../store';
import * as models from './models';
import * as actions from './blog.actions';


@Injectable()
export class TagService extends FetchService {
  
  private API_ROOT: string;
  private mapper: TagServiceMapper;
  private appStore: Store<IAppStore>;
  private blogStore$: Observable<models.IBlogStore>;
  private tags$: Observable<models.ITag[]>;
  private actionDispatch$ = new BehaviorSubject<Action>({type: null, payload: null});
  
  constructor(
    http: Http,
    mapper: TagServiceMapper,
    appStore: Store<IAppStore>,
    @Inject(BLOG_CONFIG) blogConfig: IBlogConfig
  ) {
    super(http);
    
    this.API_ROOT = `http://${blogConfig.url}/api/`;
    this.mapper = mapper;
    this.appStore = appStore;
    this.blogStore$ = appStore.select(appStore => appStore.blog);
    this.tags$ = this.blogStore$
      .filter(blogStore => !blogStore.needTags)
      .map(blogStore => blogStore.tags);
    
    this.subscribeToActions();
  }
  
  private subscribeToActions() {
    const fetchTags$ = this.actionDispatch$
      .filter(action => action.type === actions.FETCH_TAGS)
      .do(action => this.appStore.dispatch({type: actions.FETCHING_TAGS}))
      .mergeMap(
        action => this.fetchTags(),
        (action, json) => ({
          type: actions.FETCHED_TAGS,
          payload: {
            tags: this.mapper.responseToTag(json)
          }
        })
      );

    Observable
      .merge(fetchTags$)
      .subscribe((action: Action) => this.appStore.dispatch(action));
  }
  
  loadTags() {
    if(this.appStore.value.blog.needTags) {
      this.actionDispatch$.next({type: actions.FETCH_TAGS})
    }
  }
  
  getTags() {
    return this.tags$;
  }
  
  private fetchTags(): Observable<models.ITag> {
    return this.request({
      method: RequestMethod.Get,
      url: this.getTagsUrl()
    });
  }
  
  private getTagsUrl(): string {
    return `${this.API_ROOT}get_tag_index/`;
  }
  
}
