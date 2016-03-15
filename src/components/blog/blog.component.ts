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
    this.articles = [];
  }
  
  ngOnInit() {
    this._blogService.getExcepts()
      .subscribe(
        res => this.articles = res,
        err => console.error(err),
        () => console.log('excerpt done')
      );
  }
}