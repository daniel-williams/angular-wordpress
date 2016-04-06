import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {IBlogPost} from './models';


@Component({
  template: `
  <div class='row'>
    <div class='col-xs-12'>
      <h3>Blog Post List</h3>
    </div>
    <div class='col-xs-12'>
      <div *ngFor="#post of posts">
        <a [routerLink]="['BlogPostDetail', {slug:post.slug}]">{{post.title}}</a>
      </div>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES]
})

export class BlogPostListComponent {
  @Input() posts: IBlogPost[] = [];
}