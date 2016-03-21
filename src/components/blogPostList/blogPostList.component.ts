import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {IBlogPost} from '../../interfaces/IBlogStore';


@Component({
  selector: 'blog-post-list',
  template: require('./BlogPostList.component.html'),
  styles: [require('./BlogPostList.component.scss')],
  directives: [ROUTER_DIRECTIVES],
  inputs: ['posts']
})
export class BlogPostListComponent {
  posts: IBlogPost[] = [];
}