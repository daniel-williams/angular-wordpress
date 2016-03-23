import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {BlogActionCreators} from '../../actions/blog.action.creators';
import {IAppStore} from '../../interfaces/IAppStore';
import {
  IBlogStore,
  IBlogTitle,
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
    this.store$ = this.appStore.select(appStore => appStore.blog);

    this.store$
      .map(store => store.isUpdating)
      .subscribe(isUpdating => {
        this.isUpdating = isUpdating;
      });

    this.actions.loadTitles();

    if(slug === null) {
      let post$ = this.store$
        .filter(store => !store.needTitles)
        .map(store => store.postMap)
        .map(postMap => Object.keys(postMap).map(slug => postMap[slug]))
        .do(posts => this.posts = posts)
        .flatMap<IBlogPost>(posts => Observable.fromArray(posts))

      post$
        .filter(post => post.needSummary && !post.isUpdating)
        .distinctUntilChanged()
        .subscribe(post => this.actions.loadSummary(post));

    } else {

      let post$ = this.store$
        .filter(store => !store.needTitles)
        .map(store => store.postMap[slug]);

      post$
        .do(post => this.post = post)
        .filter(post => post.needBody && !post.isUpdating)
        .do(post => console.log('woof:', post))
        .subscribe(post => this.actions.loadBody(post));

    }
  }
  
}