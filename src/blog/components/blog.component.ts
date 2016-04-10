import {Component, OnInit, provide} from 'angular2/core';
import {RouteConfig, RouteData, ROUTER_DIRECTIVES} from 'angular2/router';

import {BlogService} from '../blog.service';
import {TagService} from '../tag.service';
import {BLOG_CONFIG, BlogConfig} from '../blog.config';
import {BlogServiceMapper} from '../blog.service-mapper';
import {TagServiceMapper} from '../tag.service-mapper';

import {RecentPostsComponent} from './widgets/recent-posts.component';
import {TagCloudComponent} from './widgets/tag-cloud.component';

import {BlogPostListComponent} from './blog-post-list.component';
import {BlogPostDetailComponent} from './blog-post-detail.component';


@Component({
  selector: 'blog-container',
  providers: [provide(BLOG_CONFIG, {useValue: BlogConfig}), BlogServiceMapper, BlogService, TagServiceMapper, TagService],
  directives: [RecentPostsComponent, TagCloudComponent, ROUTER_DIRECTIVES],
  template: require('./blog.component.html'),
  styles: [require('./blog.component.scss')],
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
export class BlogComponent implements OnInit {
  private blogService: BlogService;
  private tagService: TagService;
  
  constructor(
    blogService: BlogService,
    tagService: TagService
  ) {
    this.blogService = blogService;
    this.tagService = tagService;
  }

  ngOnInit() {
    this.blogService.loadSummaries();
    this.tagService.loadTags();
  }
}
