import {AfterViewChecked, Component, OnInit, ViewChild} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable} from 'rxjs';

import {Store} from '@ngrx/store';
import {BlogService} from './blog.service';
import {IAppStore} from '../store';
import {IBlogStore, IBlogPost} from './models';

import {BlogPostListComponent} from './blog-post-list.component';
import {BlogPostDetailComponent} from './blog-post-detail.component';


const POST_LIST = 'POST_LIST';
const POST_DETAIL = 'POST_DETAIL';

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
  @ViewChild(BlogPostListComponent) blogPostList: BlogPostListComponent;
  @ViewChild(BlogPostDetailComponent) blogPostDetail: BlogPostDetailComponent;

  store$: Observable<IBlogStore>;
  postMap$: Observable<any>;
  currentView: string;
  
  constructor(private blogService: BlogService, private appStore: Store<IAppStore>) {
    this.store$ = this.appStore.select(appStore => appStore.blog);
  }

  ngOnInit() {
    this.blogService.loadSummaries();
    
    this.postMap$ = this.store$
      .filter(store => !store.needSummaries)
      .map(store => store.postMap);
  }

  ngAfterViewChecked() {
    let nextView = !!this.blogPostList
      ? POST_LIST
      : !!this.blogPostDetail
        ? POST_DETAIL
        : null;
    
    if(nextView !== this.currentView) {
      this.currentView = nextView;
      
      switch(this.currentView) {
        case(POST_LIST): {
          let t = setTimeout(() => {
            
            this.postMap$
              .map(postMap => Object.keys(postMap).map(slug => postMap[slug]))
              .subscribe(posts => {
                if(this.blogPostList) {
                  this.blogPostList.posts = posts;
                }
              });
              
          }, 0); // setTimeout avoids #6005 (https://github.com/angular/angular/issues/6005)
          break;
        }
        case(POST_DETAIL): {
          let t = setTimeout(() => {
            
            let slug = this.blogPostDetail.slug;
            this.postMap$
              .map(postMap => postMap[slug])
              .do(post => this.blogPostDetail.post = post)
              .filter(post => post.needBody && !post.isUpdating)
              .subscribe(post => this.blogService.loadBody(post));
              
          }, 0); // setTimeout avoids #6005 (https://github.com/angular/angular/issues/6005)
          break;
        }
      }
    }
  }
}
