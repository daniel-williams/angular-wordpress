import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {FetchingComponent} from '../../shared/fetching/fetching.component';
import {IBlogPost} from '../../interfaces/IBlogStore';


@Component({
  selector: 'blog-post-list',
  template: require('./Blog-post-list.component.html'),
  styles: [require('./Blog-post-list.component.scss')],
  directives: [FetchingComponent, ROUTER_DIRECTIVES],
  inputs: ['posts'],
})
export class BlogPostListComponent {
  posts: IBlogPost[] = [];
}