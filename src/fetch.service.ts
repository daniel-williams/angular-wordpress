import {Injectable} from 'angular2/core';
import {Headers, Http, Request} from 'angular2/http';
import {Observable} from 'rxjs';


@Injectable()
export class FetchService {
  
  constructor(private http: Http) {
    console.log('fetch constructed');
  }
  
  protected request(options: any): Observable<any> {
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