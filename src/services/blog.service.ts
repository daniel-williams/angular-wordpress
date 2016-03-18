import {Injectable} from 'angular2/core';
import {Headers, Http, Request, RequestMethod, Response} from 'angular2/http';
import {Observable} from 'rxjs';

import {appSettings} from '../app.settings';
import * as actions from '../actions/blog.action';
import {
  IAppState,
  IBlogState,
  IBlogArticle
} from '../interfaces';


@Injectable()
export class BlogService {
  
  constructor(private http: Http) {
  }
  
  public loadExcepts(): Observable<IBlogState> {
    return this.request({
      method: RequestMethod.Get,
      url: appSettings.blog.EXCERPTS
    }).map(res => res.map(item => this.parseExcerpt(item)));
    // return this.http.get(appSettings.blog.EXCERPTS)
    //   .map(res => res.json())
    //   .map(res => res.map(item => this.parseExcerpt(item)))
    //   .map(posts => {
    //     return {
    //       type: actions.FETCH_EXCERPTS_SUCCESS,
    //       payload: {
    //         date: new Date(),
    //         posts: posts
    //       }
    //     }
    //   });
  }
  
  private parseExcerpt(item: any): IBlogArticle {
    return <IBlogArticle> Object.assign({}, item, {isLoaded: false, date: new Date(item.date)});
  }
  
  request(options: any): Observable<any> {
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
      .map((res: Response) => res.json());
  }
}


