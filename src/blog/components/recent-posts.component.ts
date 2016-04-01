import {Component, Input, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {IBlogPost} from '../models';


@Component({
  selector: 'recent-posts',
  template: require('./recent-posts.component.html'),
  styles: [require('./recent-posts.component.scss')],
  directives: [ROUTER_DIRECTIVES],
})

export class RecentPostsComponent {
  @Input() posts: IBlogPost[];
  
  constructor() { }

}