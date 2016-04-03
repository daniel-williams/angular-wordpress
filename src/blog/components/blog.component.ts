import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, RouteParams} from 'angular2/router';
import {Observable} from 'rxjs';
import {distinct} from 'rxjs/operator/distinct';
import {Store} from '@ngrx/store';

import {IAppStore} from '../../store';
import {BlogService} from '../blog.service';
import {
  IBlogStore,
  IBlogSummary,
  IBlogBody,
  IBlogPost,
  ITag,
} from '../models';

import {BlogPostComponent} from './blog-post.component';
import {BlogPostListComponent} from './blog-post-list.component';
import {RecentPostsComponent} from './widgets/recent-posts.component';
import {TagCloudComponent} from './widgets/tag-cloud.component';

import {PagerComponent} from '../../shared/pager/pager.component';
import {FetchingComponent} from '../../shared/fetching/fetching.component';


@Component({
  selector: 'blog',
  template: require('./blog.component.html'),
  styles: [require('./blog.component.scss')],
  directives: [
    PagerComponent,
    FetchingComponent,
    BlogPostListComponent,
    BlogPostComponent,
    RecentPostsComponent,
    TagCloudComponent,
    ROUTER_DIRECTIVES],
  providers: [BlogService],
})
export class BlogComponent implements OnInit {
  store$: Observable<IBlogStore>;
  
  isUpdating: boolean;
  
  postsPerPage: number;
  pageCount: number;
  currentPage: number;
  
  posts: IBlogPost[];
  recentPosts: IBlogPost[];
  post: IBlogPost;
  
  tags: ITag[];
  
  constructor(
    private appStore: Store<IAppStore>,
    private router: Router,
    private routeParams: RouteParams,
    private blogService: BlogService) {
    this.store$ = this.appStore.select(appStore => appStore.blog);
    
    var tag$ = this.store$
      .filter(store => !store.needTags)
      .map(store => store.tags)
      .subscribe(tags => {
        // console.log('assigning tags', tags);
        this.tags = tags;
      });
  }

  ngOnInit() {
    const slug: string = this.routeParams.get('slug');
    this.currentPage = +(this.routeParams.get('page') || 1);

    this.store$
      .subscribe(store => {
        this.isUpdating = store.isUpdating;
        this.postsPerPage = store.postsPerPage;
        this.pageCount = store.pageCount;
      });

    this.blogService.loadSummaries();
    this.blogService.loadTags();

    var postMap$ = this.store$
      .filter(store => !store.needSummaries)
      .map(store => store.postMap);

    postMap$
      .map(postMap => Object.keys(postMap).map(slug => postMap[slug]))
      .subscribe(posts => this.recentPosts = posts.slice(0, 5));



    // determine if we need a specific post or a list of posts
    if(slug === null) {
      let skip = this.currentPage * this.postsPerPage - this.postsPerPage;
      postMap$
        .map(postMap => Object.keys(postMap).map(slug => postMap[slug]))
        .subscribe(posts => this.posts = posts.slice(skip, skip + this.postsPerPage))
    } else {
      let post$ = postMap$
        .map(postMap => postMap[slug]);

      post$
        .subscribe(post => this.post = post);

      post$
        .filter(post => post.needBody && !post.isUpdating)
        .subscribe(post => this.blogService.loadBody(post));
    }

  }
  
  
  isFirstPage(): boolean {
    return this.currentPage === 1;
  }
  getStatus(): string {
    return this.pageCount > 0
      ? `${this.currentPage} of ${this.pageCount}`
      : '';
  }
  isLastPage(): boolean {
    return this.currentPage === this.pageCount || this.pageCount === 0;
  }
  
  onNext(event) {
    if(this.currentPage < this.pageCount) {
      this.router.navigate( ['Blog', { page: this.currentPage + 1 }] );
    }
  }
  onPrevious(event) {
    if(this.currentPage > 1) {
      this.router.navigate( ['Blog', { page: this.currentPage - 1 }] );
    }
  }
  
}