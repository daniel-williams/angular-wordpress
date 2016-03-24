import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
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

import {BlogPostListComponent} from '../blogPostList/blogPostList.component';
import {BlogPostComponent} from '../blogPost/blogPost.component';


@Component({
  selector: 'blog',
  template: require('./blog.component.html'),
  styles: [require('./blog.component.scss')],
  directives: [BlogPostListComponent, BlogPostComponent, ROUTER_DIRECTIVES],
  providers: [BlogActionCreators],
})
export class BlogComponent implements OnInit {
  store$: Observable<IBlogStore>;
  
  isUpdating: boolean;
  posts: IBlogPost[];
  post: IBlogPost;
  
  constructor(
    private appStore: Store<IAppStore>,
    private routeParams: RouteParams,
    private actions: BlogActionCreators) {
  }

  ngOnInit() {
    const slug = this.routeParams.get('slug');
    const page: number = +(this.routeParams.get('page') || 1);
    this.store$ = this.appStore.select(appStore => appStore.blog);

    this.store$
      .map(store => store.isUpdating)
      .subscribe(isUpdating => {
        this.isUpdating = isUpdating;
      });

    this.actions.loadSummaries();

    var postMap$ = this.store$
      .filter(store => !store.needSummaries)
      .map(store => store.postMap);

    if(slug === null) {
      let skip = page * 5 - 5;
      console.log('skip', skip, page);
      postMap$
        .map(postMap => Object.keys(postMap).map(slug => postMap[slug]))
        .subscribe(posts => this.posts = posts.slice(skip, skip + 5))
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
  
}