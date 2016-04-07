import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {BlogContainer} from './blog.container';


@Component({
  selector: 'blog-router',
  directives: [ROUTER_DIRECTIVES],
  template: `<router-outlet></router-outlet>`
})
@RouteConfig([
  {
    path: '/',
    name: 'BlogPostList',
    component: BlogContainer,
    data: {
      mode: 'list'
    },
    useAsDefault: true,
  },
  {
    path: '/:slug',
    name: 'BlogPostDetail',
    component: BlogContainer,
    data: {
      mode: 'detail'
    }
  },
  {
    path: '/**',
    redirectTo: ['BlogPostList']
  }
])
export class BlogRouter {}