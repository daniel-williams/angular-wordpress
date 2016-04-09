
import {OpaqueToken} from 'angular2/core';

export let BLOG_CONFIG = new OpaqueToken('blog.config');

export interface IBlogConfig {
  url: string,
  postsPerPage: number,
}

export const BlogConfig: IBlogConfig = {
  url: 'blog.skyberrystudio.com',
  postsPerPage: 5,
}

