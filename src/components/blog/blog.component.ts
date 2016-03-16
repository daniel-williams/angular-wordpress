import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {BlogService} from '../../services/blog.service';
import {BlogArticle} from '../../interfaces';


@Component({
    selector: 'blog',
    template: require('./blog.component.html'),
    styles: [require('./blog.component.scss')],
    directives: [ROUTER_DIRECTIVES],
    providers: [BlogService]
})
export class BlogComponent implements OnInit {
  articles: BlogArticle[];
  
  constructor(private _blogService: BlogService) {
    _blogService.blog.subscribe(
      res => {
        this.articles = res.posts
      },
      err => console.error(err),
      () => console.log('articles fetched')
    );
  }
  
  ngOnInit() {
    this._blogService.loadExcepts();
  }
}