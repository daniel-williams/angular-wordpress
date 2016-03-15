import {Http} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

import {appSettings} from '../app.settings';
import {BlogArticle} from '../interfaces';


@Injectable()
export class BlogService {
  
  constructor(private _http: Http) {
  }
  
  public getExcepts(): Observable<BlogArticle[]> {
    return this._http.get(appSettings.blog.EXCERPTS)
      .map(res => res.json())
      .map(res => res.map(item => this.parseExcerpt(item)));
  }
  
  private parseExcerpt(item: any): BlogArticle {
    return <BlogArticle> Object.assign({}, item, {isLoaded: false, date: new Date(item.date)});
  }

}


