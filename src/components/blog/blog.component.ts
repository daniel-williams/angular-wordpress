import {ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {BlogActionCreators} from '../../actions/blog.action.creators';
import {BlogService} from '../../services/blog.service';
import {
  IAppStore,
  IBlogStore,
  IBlogPost
} from '../../interfaces';

import {BlogListComponent} from '../blogList/blogList.component';


@Component({
    selector: 'blog',
    template: require('./blog.component.html'),
    styles: [require('./blog.component.scss')],
    directives: [BlogListComponent, ROUTER_DIRECTIVES],
    providers: [BlogActionCreators, BlogService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent implements OnInit {
  
  store$: Observable<IBlogStore>;
  isUpdating: boolean;
  articles: IBlogPost[];
  
  constructor(
    private appStore: Store<IAppStore>,
    private actions: BlogActionCreators,
    private cd: ChangeDetectorRef) {
  }
  
  ngOnInit() {
    this.store$ = this.appStore.select<IBlogStore>(state => state.blog);
    
    this.store$.map(e => e.isUpdating).subscribe(e => {
      this.isUpdating = e;
      this.cd.markForCheck();
    });
    
    this.store$.map(e => e.posts).subscribe(e => {
      this.articles = e;
      this.cd.markForCheck();
    });
    
    // check for needed data in store
    this.actions.loadExcerptsAsNeeded();
  }
}