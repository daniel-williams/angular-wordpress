import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {IBlogPost} from '../../interfaces';


@Component({
    selector: 'blog-list',
    template: require('./blogList.component.html'),
    styles: [require('./blogList.component.scss')],
    directives: [ROUTER_DIRECTIVES],
    inputs: ['articles']
})
export class BlogListComponent {
  
  articles: IBlogPost[] = [];
  
  constructor() {}
  
}