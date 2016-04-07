import {Component, OnInit, provide} from 'angular2/core';
import {CanReuse, RouteData, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable} from 'rxjs';

import {Store} from '@ngrx/store';
import {BLOG_CONFIG, BlogConfig} from './blog.config';
import {BlogService} from './blog.service';
import {IAppStore} from '../store';
import {IBlogStore, IBlogPost} from './models';

import {BlogPostListComponent} from './blog-post-list.component';
import {BlogPostDetailComponent} from './blog-post-detail.component';
import {RecentPostsComponent} from './components/widgets/recent-posts.component';


@Component({
  selector: 'blog-container',
  providers: [provide(BLOG_CONFIG, {useValue: BlogConfig}), BlogService],
  directives: [BlogPostListComponent, BlogPostDetailComponent, RecentPostsComponent, ROUTER_DIRECTIVES],
  template: `
  <div class='container'>
    <div class='row'>
      <div class='col-xs-12'>
        <h1>Blog</h1>
      </div>
    </div>
    <div class='row'>
      <div class='col-sm-4 hidden-xs'>
        <recent-posts [posts]='recentPosts'></recent-posts>
      </div>
      <div class='col-sm-8'>
        <blog-post-list *ngIf='mode === "list" && posts' [posts]='posts'></blog-post-list>
        <blog-post-detail *ngIf='mode === "detail" && post' [post]='post'></blog-post-detail>
      </div>
    </div>
  </div>
`,
})
export class BlogContainer implements CanReuse, OnInit {

  private store$: Observable<IBlogStore>;
  private postMap$: Observable<any>;
  
  private mode: string;
  
  private posts: IBlogPost[];
  private recentPosts: IBlogPost[];
  
  private slug: string;
  private post: IBlogPost;
  
  constructor(
    private blogService: BlogService,
    private appStore: Store<IAppStore>,
    private routeParams: RouteParams,
    routeData: RouteData
  ) {
    this.store$ = this.appStore.select(appStore => appStore.blog);
    this.mode = (<any>routeData.data).mode;
    this.slug = routeParams.get('slug');
  }

  ngOnInit() {
    this.blogService.loadSummaries();
    
    this.postMap$ = this.store$
      .filter(store => !store.needSummaries)
      .map(store => store.postMap);
    
    this.postMap$
      .map(postMap => Object.keys(postMap).map(slug => postMap[slug]).slice(0,5))
      .subscribe(posts => {
        this.recentPosts = posts;
      });
    
    this.getPostData();
  }
  
  getPostData() {
    if(this.mode === 'list') {
      this.postMap$
        .map(postMap => Object.keys(postMap).map(slug => postMap[slug]))
        .subscribe(posts => this.posts = posts);
    } else if(this.mode === 'detail') {
      this.postMap$
        .map(postMap => postMap[this.slug])
        .do(post => this.post = post)
        .filter(post => post.needBody && !post.isUpdating)
        .subscribe(post => this.blogService.loadBody(post));
    }
  }
  
  routerCanReuse(next, prev) {
    this.mode = (<any>next.routeData.data).mode;
    this.slug = next.params.slug;
    this.getPostData();
    return true;
  }
  
}
