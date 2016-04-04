import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable, Subject} from 'rxjs';

import {BlogService} from './blog.service';
import {BplComponent} from './bpl.component';
import {BpdComponent} from './bpd.component';


let test: Subject<string> = new Subject();


@Component({
  providers: [BlogService],
  selector: 'blog',
  template: `
  <div>
    <h1>Blog</h1>
    <router-outlet></router-outlet>
  </div>
`,
  directives: [ROUTER_DIRECTIVES],
})
@RouteConfig([
  {
    path: '/',
    name: 'BlogPostList',
    component: BplComponent,
    useAsDefault: true,
    data: {
      test: test
    }
  },
  {
    path: '/:slug',
    name: 'BlogPostDetail',
    component: BpdComponent,
  },
  {
    path: '/**',
    redirectTo: ['BlogPostList']
  }
])
export class BlogContainer implements OnInit {
  
  constructor() {
    
    console.log('BlogContainer constructed');
  }
  
  ngOnInit() {
    test.next('what the what');
  }
}