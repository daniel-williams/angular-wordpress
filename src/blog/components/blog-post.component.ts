import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {FetchingComponent} from '../../shared/fetching/fetching.component';
import {IBlogPost} from '../../interfaces/IBlogStore';


@Component({
  selector: 'blog-post',
  template: require('./blog-post.component.html'),
  styles: [require('./blog-post.component.scss')],
  directives: [FetchingComponent, ROUTER_DIRECTIVES],
  inputs: ['post']
})
export class BlogPostComponent {
  post: IBlogPost = null;
}