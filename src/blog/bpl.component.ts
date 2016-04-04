import {Component, OnInit, Input} from 'angular2/core';
import {RouteData, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable} from 'rxjs';

import {Store} from '@ngrx/store';

import {BlogService} from './blog.service';
import {IAppStore} from '../store';
import {IBlogStore, IBlogPost} from './models';

@Component({
  template: `
  <div class='row'>
    <div class='col-xs-12'>
      <h3>Blog Post List</h3>
    </div>
    <div class='col-xs-12'>
      <div *ngFor="#post of posts">
        <a [routerLink]="['BlogPostDetail', {slug:post.slug}]">{{post.title}}</a>
      </div>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES]
})

export class BplComponent implements OnInit {
  store$: Observable<IBlogStore>;
  @Input()posts: IBlogPost[];
  test$: Observable<string>;
  
  constructor(routeData: RouteData, private appStore: Store<IAppStore>, private blogService: BlogService) {
    console.log('bpl trying');
    console.log('route data:', routeData.data);
    try {
      let tmp = routeData.data as any; 
      this.test$ = tmp.test as Observable<string>;
      this.test$.subscribe(note => console.log('container:', note));
    } catch(err) {
      console.log('boom:', err);
    } 

    this.store$ = this.appStore.select(appStore => appStore.blog);
  }

  ngOnInit() {
    this.blogService.loadSummaries();
    
    var postMap$ = this.store$
      .filter(store => !store.needSummaries)
      .map(store => store.postMap);
    
    postMap$
      .map(postMap => Object.keys(postMap).map(slug => postMap[slug]))
      .subscribe(posts => this.posts = posts)
  }

}