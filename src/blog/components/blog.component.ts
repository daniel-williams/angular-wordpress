import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, RouteParams} from 'angular2/router';
import {Observable} from 'rxjs';
import {distinct} from 'rxjs/operator/distinct';
import {Store} from '@ngrx/store';

import {IAppStore} from '../../store';
import {PagerComponent} from '../../shared/pager/pager.component';

import {BlogActionCreators} from '../blog.action.creators';
import {BlogPostComponent} from './blog-post.component';
import {BlogPostListComponent} from './blog-post-list.component';
import {
  IBlogStore,
  IBlogSummary,
  IBlogBody,
  IBlogPost,
} from '../models';


@Component({
  selector: 'blog',
  template: require('./blog.component.html'),
  styles: [require('./blog.component.scss')],
  directives: [PagerComponent, BlogPostListComponent, BlogPostComponent, ROUTER_DIRECTIVES],
  providers: [BlogActionCreators],
})
export class BlogComponent implements OnInit {
  store$: Observable<IBlogStore>;
  
  isUpdating: boolean;
  isFirst: boolean;
  isLast: boolean;
  
  postsPerPage: number;
  pageCount: number;
  currentPage: number;
  
  posts: IBlogPost[];
  post: IBlogPost;
  
  constructor(
    private appStore: Store<IAppStore>,
    private router: Router,
    private routeParams: RouteParams,
    private actions: BlogActionCreators) {
  }

  ngOnInit() {
    const slug: string = this.routeParams.get('slug');
    this.currentPage = +(this.routeParams.get('page') || 1);
    this.store$ = this.appStore.select(appStore => appStore.blog);

    this.store$
      .subscribe(store => {
        this.isUpdating = store.isUpdating;
        this.postsPerPage = store.postsPerPage;
        this.pageCount = store.pageCount;
        this.isFirst = this.currentPage === 1;
        this.isLast = this.currentPage === this.pageCount;
      });

    this.actions.loadSummaries();

    var postMap$ = this.store$
      .filter(store => !store.needSummaries)
      .map(store => store.postMap);

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
        .subscribe(post => this.actions.loadBody(post));
    }

  }
  
  getStatus(): string {
    return `${this.currentPage} of ${this.pageCount}`;
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