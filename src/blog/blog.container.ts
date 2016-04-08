import {Component, OnInit, provide} from 'angular2/core';
import {RouteConfig, RouteData, ROUTER_DIRECTIVES} from 'angular2/router';

import {BLOG_CONFIG, BlogConfig} from './blog.config';
import {BlogService} from './blog.service';

import {EmptyComponent} from './empty.component';
import {BlogPostListComponent} from './blog-post-list.component';
import {BlogPostDetailComponent} from './blog-post-detail.component';
import {RecentPostsComponent} from './components/widgets/recent-posts.component';


@Component({
  selector: 'blog-container',
  providers: [provide(BLOG_CONFIG, {useValue: BlogConfig}), BlogService],
  directives: [RecentPostsComponent, ROUTER_DIRECTIVES],
  template: `
  <div class='container'>
    <div class='row'>
      <div class='col-xs-12'>
        <h1>Blog</h1>
      </div>
    </div>
    <div class='row'>
      <div class='col-sm-4 hidden-xs'>
        <recent-posts></recent-posts>
      </div>
      <div class='col-sm-8'>
        <router-outlet></router-outlet>
      </div>
    </div>
  </div>
`,
})
@RouteConfig([
  {
    path: '/',
    name: 'BlogPostList',
    component: BlogPostListComponent,
    data: {
      mode: 'list'
    },
    useAsDefault: true,
  },
  {
    path: '/:slug',
    name: 'BlogPostDetail',
    component: BlogPostDetailComponent,
    data: {
      mode: 'detail'
    }
  },
  {
    path: '/**',
    redirectTo: ['BlogPostList']
  }
])
export class BlogContainer implements OnInit {

  constructor(private blogService: BlogService){
  }

  ngOnInit() {
    this.blogService.loadSummaries();
  }
}
