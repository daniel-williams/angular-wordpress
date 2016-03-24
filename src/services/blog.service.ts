import {Injectable} from 'angular2/core';
import {Headers, Http, Request, RequestMethod, Response} from 'angular2/http';
import {Observable} from 'rxjs';

import {appSettings} from '../app.settings';
import * as actions from '../actions/blog.action';
import {IAppStore} from '../interfaces/IAppStore';
import {
  IBlogStore,
  IBlogSummary,
  IBlogBody,
  IBlogPost,
} from '../interfaces/IBlogStore';


@Injectable()
export class BlogService {
  
  constructor(private http: Http) {}
  
  public fetchSummaries(): Observable<IBlogSummary[]> {
    return this.request({
      method: RequestMethod.Get,
      url: appSettings.blog.getSummariesUrl()})
  }
  
  public fetchBody(id: number): Observable<IBlogBody> {
    return this.request({
      method: RequestMethod.Get,
      url: appSettings.blog.getBodyUrl(id)})
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
}
