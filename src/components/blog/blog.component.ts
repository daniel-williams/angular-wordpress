import {ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit} from 'angular2/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent implements OnInit {
  store$: Observable<IBlogStore>;
  
  isUpdating: boolean;
  posts: IBlogPost[];
  post: IBlogPost;
  
  constructor(
    private appStore: Store<IAppStore>,
    private routeParams: RouteParams,
    private cd: ChangeDetectorRef,
    private actions: BlogActionCreators) {
  }
  
  ngOnInit() {
    const slug = this.routeParams.get('slug');
    this.store$ = this.appStore.select(appStore => appStore.blog);
    
    this.store$.map(store => store.isUpdating).subscribe(isUpdating => {
      this.isUpdating = isUpdating;
      this.cd.markForCheck();
    });
    
    this.actions.loadTitles();
    
    if(slug === null) {
      
      this.store$
        .filter(store => !store.needTitles && !store.isUpdating)
        .map(store => store.postMap)
        .subscribe(postMap => {
          this.posts = Object.keys(postMap).map(slug => postMap[slug]);
          this.posts.forEach(item => item.needSummary && this.actions.loadSummary(item.slug));
        });
        
    } else {
      
      this.store$
        .filter(store => !store.needTitles && !store.isUpdating)
        .map(store => store.postMap)
        .filter(post => post[slug].needBody)
        .subscribe(() => this.actions.loadBody(slug));
        
      this.store$
        .filter(store => !store.needTitles)
        .map(store => store.postMap)
        .map(postMap => postMap[slug])
        .subscribe(post => this.post = post);
    }
  }
}