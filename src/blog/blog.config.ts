
import {OpaqueToken} from 'angular2/core';

export let BLOG_CONFIG = new OpaqueToken('blog.config');

export interface IBlogConfig {
  url: string,
}

export const BlogConfig = {
  url:'blog.skyberrystudio.com'
}

