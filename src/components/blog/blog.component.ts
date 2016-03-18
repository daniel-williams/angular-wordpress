import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {BlogActionCreators} from '../../actions/blog.action.creators';
import {BlogService} from '../../services/blog.service';
import {
  IAppState,
  IBlogState,
  IBlogArticle
} from '../../interfaces';


@Component({
    selector: 'blog',
    template: require('./blog.component.html'),
    styles: [require('./blog.component.scss')],
    directives: [ROUTER_DIRECTIVES],
    providers: [BlogActionCreators, BlogService]
})
export class BlogComponent implements OnInit {

  isUpdating$: Observable<boolean>;
  articles$: Observable<IBlogArticle[]>;
  
  constructor(private store: Store<IAppState>, private actions: BlogActionCreators) {
    const store$ = this.store.select<IBlogState>(state => state.blog);
    
    this.isUpdating$ = store$.map(data => data.isUpdating);
    this.articles$ = store$.map(data => data.posts);
  }
  
  ngOnInit() {
    this.actions.loadExcerpts();
  }
}