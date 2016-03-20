import {Injectable} from 'angular2/core';
import {Headers, Http, Request, RequestMethod, Response} from 'angular2/http';
import {Observable} from 'rxjs';

import {appSettings} from '../app.settings';
import * as actions from '../actions/blog.action';
import {
  IAppStore,
  IBlogPost,
  IBlogBody,
  IBlogStore,
} from '../interfaces';


@Injectable()
export class BlogService {
  
  constructor(private http: Http) {}
  
  public loadExcepts(): Observable<IBlogStore> {
    return this.request({
      method: RequestMethod.Get,
      url: appSettings.blog.EXCERPTS
    }).map(res => res.map(item => Object.assign({}, item,
      {
        isLoaded: false,
        date: new Date(item.date)
      }
    )));
  }
  
  public loadBody(id: number): Observable<IBlogBody> {
    return this.request({
      method: RequestMethod.Get,
      url: appSettings.blog.getPostBodyEndpoint(id)
    }).map(item => <IBlogBody>(
      {
        id: id,
        content: item.content,
      }
    ));
  }
  
  // private parseExcerpt(item: any): IBlogPost {
  //   return <IBlogPost> Object.assign({}, item, {isLoaded: false, date: new Date(item.date)});
  // }
  
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
