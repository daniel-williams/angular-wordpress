import {Inject, Injectable} from 'angular2/core';

import {BLOG_CONFIG, IBlogConfig} from './blog.config';
import * as models from './models';


@Injectable()
export class BlogServiceMapper {
  
  private postsPerPage;
  
  constructor(@Inject(BLOG_CONFIG) blogConfig: IBlogConfig) {
    this.postsPerPage = blogConfig.postsPerPage || 5;
  } 

  ResponseToPostMap(json: any): models.IPostMap {
    let postMap = json.posts.reduce((accum, item) => {
      accum[item.slug] = {
        id: item.id,
        title: item.title,
        slug: item.slug,
        date: new Date(item.date),
        summary: item.excerpt,
        needBody: true,
        isUpdating: false,
      };
      return accum;
    }, {});
    let postCount = json.count_total;
    let pageCount = Math.ceil(postCount / this.postsPerPage);
    
    return {
      postMap,
      postCount,
      pageCount,
    } 
  }
  
  ResponseToBlogBody(json: any): models.IBlogBody {
    let post = json.post;
    return {
      id: post.id,
      body: post.content,
    }
  }
}