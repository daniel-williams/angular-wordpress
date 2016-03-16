import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {Store} from '@ngrx/store';

import * as actions from '../actions/blog.action';
import {appSettings} from '../app.settings';
import {AppState, BlogState, BlogArticle} from '../interfaces';


@Injectable()
export class BlogService {
  blog: Observable<BlogState>;
  
  constructor(private _http: Http, private store: Store<AppState>) {
    this.blog = store.select(state => state.blog);
  }
  
  public loadExcepts() {
    return this._http.get(appSettings.blog.EXCERPTS)
      .map(res => res.json())
      .map(res => res.map(item => this.parseExcerpt(item)))
      .map(posts => {
        return {
          type: actions.FETCH_EXCERPTS_SUCCESS,
          payload: {
            date: new Date(),
            posts: posts
          }
        }
      })
      .subscribe(action => this.store.dispatch(action));
  }
  
  private parseExcerpt(item: any): BlogArticle {
    return <BlogArticle> Object.assign({}, item, {isLoaded: false, date: new Date(item.date)});
  }

}


