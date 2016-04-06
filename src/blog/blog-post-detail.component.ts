import {Component, Input} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

import {IBlogPost} from './models';
import {FetchingComponent} from '../shared/components';

@Component({
  template: `
  <div class='row'>
    <div class='col-xs-12'>
      <a [routerLink]="['BlogPostList']">Back</a>
    </div>
  </div>
  <fetching *ngIf='!post'></fetching>
  <div *ngIf='post' class='row'>
    <div class='col-xs-12'>
      <h3>{{post.title}}</h3>
    </div>
    <fetching *ngIf='post.needBody'></fetching>
    <div *ngIf='!post.needBody' class='col-xs-12'>
      <div [innerHTML]="post.body"></div>
    </div>
  </div>
  `,
  directives: [ROUTER_DIRECTIVES]
})

export class BlogPostDetailComponent {
  post: IBlogPost;
  slug: string;
  
  constructor(private routeParams: RouteParams) {
    this.slug = this.routeParams.get('slug');
  }
}