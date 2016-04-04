import {Component, OnInit, Input} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable} from 'rxjs';

import {Store} from '@ngrx/store';

import {BlogService} from './blog.service';
import {IAppStore} from '../store';
import {IBlogStore, IBlogPost} from './models';

@Component({
  template: `
  <div class='row'>
    <div class='col-xs-12'>
      <a [routerLink]="['BlogPostList']">Back</a>
    </div>
    <div class='col-xs-12'>
      <h3>{{post.title}}</h3>
    </div>
    <div class='col-xs-12'>
      <div [innerHTML]="post.body"></div>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES]
})

export class BpdComponent implements OnInit {
  store$: Observable<IBlogStore>;
  post: IBlogPost;
  
  constructor(private routeParams: RouteParams, private appStore: Store<IAppStore>, private blogService: BlogService) {
    console.log('bpd trying');
    
    this.store$ = this.appStore.select(appStore => appStore.blog);
  }

  ngOnInit() {
    const slug: string = this.routeParams.get('slug');
    
    var postMap$ = this.store$
      .filter(store => !store.needSummaries)
      .map(store => store.postMap);
    
    let post$ = postMap$
        .map(postMap => postMap[slug]);

      post$
        .subscribe(post => this.post = post);

      post$
        .filter(post => post.needBody && !post.isUpdating)
        .subscribe(post => this.blogService.loadBody(post));
  }

}