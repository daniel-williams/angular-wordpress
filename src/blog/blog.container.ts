import {Component, OnInit, provide} from 'angular2/core';
import {RouteConfig, RouteData, ROUTER_DIRECTIVES} from 'angular2/router';

import {BlogService} from './blog.service';
import {TagService} from './tag.service';
import {BLOG_CONFIG, BlogConfig} from './blog.config';
import {BlogResponseMapper} from './blog.response-mapper';

import {RecentPostsComponent} from './components/widgets/recent-posts.component';
import {TagCloudComponent} from './components/widgets/tag-cloud.component';

import {BlogPostListComponent} from './components/blog-post-list.component';
import {BlogPostDetailComponent} from './components/blog-post-detail.component';


@Component({
  selector: 'blog-container',
  providers: [provide(BLOG_CONFIG, {useValue: BlogConfig}), BlogResponseMapper, BlogService, TagService],
  directives: [RecentPostsComponent, TagCloudComponent, ROUTER_DIRECTIVES],
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
        <tag-cloud></tag-cloud>
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
    useAsDefault: true,
  },
  {
    path: '/:slug',
    name: 'BlogPostDetail',
    component: BlogPostDetailComponent,
  },
  {
    path: '/**',
    redirectTo: ['BlogPostList']
  }
])
export class BlogContainer implements OnInit {

  constructor(private blogService: BlogService, private tagService: TagService){}

  ngOnInit() {
    this.blogService.loadSummaries();
    this.tagService.loadTags();
  }
}
