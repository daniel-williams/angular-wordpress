import {Injectable} from 'angular2/core';
import {Headers, Http, Request, RequestMethod, Response} from 'angular2/http';
import {Observable} from 'rxjs';

import {IAppStore} from '../store';
import {
  IBlogStore,
  IBlogSummary,
  IBlogBody,
  IBlogPost,
  ITag,
} from './models';
import {BLOG_URL} from './blog.config';
import * as actions from './blog.action';


@Injectable()
export class BlogService {
  
  private API_ROOT: string;
  
  constructor(private http: Http) {
     this.API_ROOT = `http://${BLOG_URL}/api/`;
  }
  
  public fetchSummaries(): Observable<IBlogSummary[]> {
    return this.request({
      method: RequestMethod.Get,
      url: this.getSummariesUrl()
    });
  }
  
  public fetchBody(id: number): Observable<IBlogBody> {
    return this.request({
      method: RequestMethod.Get,
      url: this.getBodyUrl(id)
    });
  }
  
  public fetchTags(): Observable<ITag> {
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
}
