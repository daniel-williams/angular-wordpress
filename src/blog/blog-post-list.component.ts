import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {BlogService} from './blog.service';
import {IBlogPost} from './models';
import {FetchingComponent} from '../shared/components';


@Component({
  selector: 'blog-post-list',
  directives: [FetchingComponent, ROUTER_DIRECTIVES],
  template: `
  <div class='row'>
    <div class='col-xs-12'>
      <h3>Blog Post List</h3>
    </div>
    <fetching *ngIf='!posts'></fetching>
    <div *ngIf='posts' class='col-xs-12'>
      <div *ngFor="#post of posts">
        <a [routerLink]="['BlogPostDetail', {slug:post.slug}]">{{post.title}}</a>
      </div>
    </div>
  `,
})
export class BlogPostListComponent implements OnInit {
  posts: IBlogPost[];
  
  constructor(private blogService: BlogService) {
  }
  
  ngOnInit() {
    this.blogService
      .getPosts()
      .subscribe(posts => this.posts = posts);
  }
}