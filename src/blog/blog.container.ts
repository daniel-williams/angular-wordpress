import {AfterViewChecked, Component, OnInit, ViewChild} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable} from 'rxjs';

import {Store} from '@ngrx/store';
import {BlogService} from './blog.service';
import {IAppStore} from '../store';
import {IBlogStore, IBlogPost} from './models';

import {BlogPostListComponent} from './blog-post-list.component';
import {BlogPostDetailComponent} from './blog-post-detail.component';
import {RecentPostsComponent} from './components/widgets/recent-posts.component';
// import {TagCloudComponent} from './components/widgets/tag-cloud.component';

const POST_LIST = 'POST_LIST';
const POST_DETAIL = 'POST_DETAIL';

@Component({
  providers: [BlogService],
  selector: 'blog',
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
        <recent-posts [posts]='recentPosts'></recent-posts>
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
export class BlogContainer implements AfterViewChecked, OnInit {
  @ViewChild(BlogPostListComponent)
  blogPostList: BlogPostListComponent;
  
  @ViewChild(BlogPostDetailComponent)
  blogPostDetail: BlogPostDetailComponent;

  store$: Observable<IBlogStore>;
  postMap$: Observable<any>;
  
  recentPosts: IBlogPost[];
  currentView: string;
  
  constructor(private blogService: BlogService, private appStore: Store<IAppStore>) {
    this.store$ = this.appStore.select(appStore => appStore.blog);
  }

  ngOnInit() {
    this.blogService.loadSummaries();
    
    this.postMap$ = this.store$
      .filter(store => !store.needSummaries)
      .map(store => store.postMap);
    
    this.postMap$
      .map(postMap => Object.keys(postMap).map(slug => postMap[slug]).slice(0,5))
      .subscribe(posts => this.recentPosts = posts);
  }

  ngAfterViewChecked() {
    let nextView = !!this.blogPostList
      ? POST_LIST
      : !!this.blogPostDetail
        ? POST_DETAIL
        : null;
    
    if(nextView !== this.currentView) {
      this.currentView = nextView;
      
      // setTimeout avoids #6005 (https://github.com/angular/angular/issues/6005)
      setTimeout(() => {
        switch(this.currentView) {
          case(POST_LIST): {
            this.postMap$
              .map(postMap => Object.keys(postMap).map(slug => postMap[slug]))
              .subscribe(posts => {
                if(this.blogPostList) {
                  this.blogPostList.posts = posts;
                }
              });
            break;
          }
          case(POST_DETAIL): {
            let slug = this.blogPostDetail.slug;
            this.postMap$
              .map(postMap => postMap[slug])
              .do(post => this.blogPostDetail.post = post)
              .filter(post => post.needBody && !post.isUpdating)
              .subscribe(post => this.blogService.loadBody(post));
            break;
          }
        }
      }, 0); // end setTimeout
    }
  }
}
