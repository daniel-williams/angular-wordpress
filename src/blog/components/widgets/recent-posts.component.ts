import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {BlogService} from '../../blog.service';
import {IBlogPost} from '../../models';


@Component({
  selector: 'recent-posts',
  template: require('./recent-posts.component.html'),
  styles: [require('./recent-posts.component.scss')],
  directives: [ROUTER_DIRECTIVES],
})
export class RecentPostsComponent implements OnInit {
  private blogService: BlogService
  private posts: IBlogPost[];
  
  constructor(blogService: BlogService) {
    this.blogService = blogService;
  }
  
  ngOnInit() {
    this.blogService
      .getRecentPosts()
      .subscribe(posts => this.posts = posts);
  }
}