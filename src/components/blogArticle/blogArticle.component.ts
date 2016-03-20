import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {BlogActionCreators} from '../../actions/blog.action.creators';
import {BlogService} from '../../services/blog.service';
import {
  IAppStore,
  IBlogStore,
  IBlogPost
} from '../../interfaces';


@Component({
  selector: 'blog-article',
  template: require('./blogArticle.component.html'),
  styles: [require('./blogArticle.component.scss')],
  providers: [BlogActionCreators, BlogService],
})
export class BlogPostComponent implements OnInit {
  
  id: number;
  isUpdating: boolean;
  article: IBlogPost;
  
  constructor(
    private store: Store<IAppStore>,
    private actions: BlogActionCreators,
    private routeParams: RouteParams) {
      
      this.id = parseInt(this.routeParams.get('id'), 10);
      const store$ = this.store.select<IBlogStore>(state => state.blog);
    
      store$.map(data => this.isUpdating = data.isUpdating);

      store$.mergeMap(store => Observable
        .fromArray(store.posts)
        .filter(post => post.id === this.id)
      ).subscribe(item => this.article = <IBlogPost>item);
    }

  ngOnInit() {
    this.actions.loadBody(this.id);
  }
}