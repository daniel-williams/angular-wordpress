import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {FetchingComponent} from '../../shared/fetching/fetching.component';
import {IBlogPost} from '../models';


@Component({
  selector: 'blog-post-list',
  template: require('./Blog-post-list.component.html'),
  styles: [require('./Blog-post-list.component.scss')],
  directives: [FetchingComponent, ROUTER_DIRECTIVES],
})
export class BlogPostListComponent {
  @Input() posts: IBlogPost[] = [];
}