import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, RouteParams} from 'angular2/router';
import {Observable} from 'rxjs';
import {distinct} from 'rxjs/operator/distinct';
import {Store} from '@ngrx/store';

import {BlogActionCreators} from '../../actions/blog.action.creators';
import {IAppStore} from '../../interfaces/IAppStore';
import {
  IBlogStore,
  IBlogSummary,
  IBlogBody,
  IBlogPost,
} from '../../interfaces/IBlogStore';

import {PagerComponent} from '../../shared/pager/pager.component';
import {BlogPostListComponent} from './blog-post-list.component';
import {BlogPostComponent} from './blog-post.component';


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
  
  itemsPerPage: number;
  totalPages: number;
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
        this.itemsPerPage = store.itemsPerPage;
        this.totalPages = store.totalPages;
        this.isFirst = this.currentPage === 1;
        this.isLast = this.currentPage === this.totalPages;
      });

    this.actions.loadSummaries();

    var postMap$ = this.store$
      .filter(store => !store.needSummaries)
      .map(store => store.postMap);

    if(slug === null) {
      let skip = this.currentPage * this.itemsPerPage - this.itemsPerPage;
      postMap$
        .map(postMap => Object.keys(postMap).map(slug => postMap[slug]))
        .subscribe(posts => this.posts = posts.slice(skip, skip + this.itemsPerPage))
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
    return `${this.currentPage} of ${this.totalPages}`;
  }
  
  onNext(event) {
    if(this.currentPage < this.totalPages) {
      this.router.navigate( ['Blog', { page: this.currentPage + 1 }] );
    }
  }
  onPrevious(event) {
    if(this.currentPage > 1) {
      this.router.navigate( ['Blog', { page: this.currentPage - 1 }] );
    }
  }
  
}