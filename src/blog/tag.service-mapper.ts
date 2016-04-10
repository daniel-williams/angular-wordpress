import {Injectable} from 'angular2/core';
import * as models from './models';


@Injectable()
export class TagServiceMapper {

  responseToTag(json: any): models.ITag[] {
    return json.tags.map(tag => ({
      id: tag.id,
      title: tag.title,
      slug: tag.slug,
      description: tag.description,
      count: tag.post_count,
    }));
  }
}