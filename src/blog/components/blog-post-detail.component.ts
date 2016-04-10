import {Component, OnInit} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {Location} from 'angular2/router';

import {BlogService} from '../blog.service';
import {IBlogPost} from '../models';
import {FetchingComponent} from '../../shared/components/fetching/fetching.component';


@Component({
  selector: 'blog-post-detail',
  directives: [FetchingComponent, ROUTER_DIRECTIVES],
  template: require('./blog-post-detail.component.html'),
  styles: [require('./blog-post-detail.component.scss')],
})
export class BlogPostDetailComponent {
  private location: Location;
  private blogService: BlogService;
  private slug: string;
  private post: IBlogPost = null;
  
  constructor(location: Location, routeParams: RouteParams, blogService: BlogService) {
    this.location = location;
    this.blogService = blogService;
    this.slug = routeParams.get('slug');
  }
  
  ngOnInit() {
    this.blogService
      .getPost(this.slug)
      .subscribe(post => this.post = post);
  }
  
  back() {
    this.location.back();
  }
}