import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {FetchingComponent} from '../fetching/fetching.component';
import {IBlogPost} from '../../interfaces/IBlogStore';


@Component({
  selector: 'blog-post',
  template: require('./blogPost.component.html'),
  styles: [require('./blogPost.component.scss')],
  directives: [FetchingComponent, ROUTER_DIRECTIVES],
  inputs: ['post']
})
export class BlogPostComponent {
  post: IBlogPost = null;
}