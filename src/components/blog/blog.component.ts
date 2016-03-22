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
    
    this.store$.map(store => store.isUpdating).subscribe(isUpdating => {
      this.isUpdating = isUpdating;
    });
    
    this.actions.loadTitles();
    
    if(slug === null) {
      let post$ = this.store$
        .filter(store => !store.needTitles)
        .map(store => Object.keys(store.postMap).map(slug => store.postMap[slug]));

      post$.subscribe(posts => this.posts = posts);

      post$.flatMap<IBlogPost>(posts => Observable.fromArray(posts))
        .filter(post => post.needSummary && !post.isUpdating)
        .subscribe(post => {
          this.actions.loadSummary(post.slug)
        });
        
    } else {
      
      this.store$
        .filter(store => !store.needTitles && !store.isUpdating)
        .map(store => store.postMap)
        .filter(post => post[slug].needBody && !post[slug].isUpdating)
        .subscribe(() => this.actions.loadBody(slug));
        
      this.store$
        .filter(store => !store.needTitles)
        .map(store => store.postMap)
        .map(postMap => postMap[slug])
        .subscribe(post => this.post = post);
    }
  }
  
}