import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable} from 'rxjs';

import {TagService} from '../../tag.service';
import {ITag} from '../../models';


@Component({
  selector: 'tag-cloud',
  template: require('./tag-cloud.component.html'),
  styles: [require('./tag-cloud.component.scss')],
  directives: [ROUTER_DIRECTIVES],
})
export class TagCloudComponent implements OnInit {
  private tagMeta: Array<any>;
  
  constructor(private tagService: TagService) {}

  ngOnInit() {
    this.tagService.getTags()
      .subscribe(tags => this.tagMeta = makeWordCloud(tags))
  }
}

interface ITagMeta{
  slug: string,
  title: string,
  style: any,
}

function makeWordCloud(tags: ITag[], options?: any): Array<any> {
  let weights = tags
    .slice(0)
    .map(tag => tag.count || 0)
    .sort((a, b) => b - a );
  let upperBound = weights[0];
  let lowerBound = weights[ weights.length - 1 ];
  let denominator = upperBound - lowerBound;

  options = Object.assign({}, {
    isBlackWhite: true,
    shuffle: true,
  }, options);

  options.shuffle && shuffle(tags);
    
  return tags.map(tag => {
    let style = {
      'font-size': `${((tag.count - lowerBound) / denominator) * 10 + 14}px`,
      'color': getRandomColor(options.isBlackWhite)
    };
    return {
      slug: tag.slug,
      title: tag.title,
      style: style
    }
  });
}

function shuffle(tags: ITag[]) {
  for(let i = tags.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = tags[i];
    tags[i] = tags[j];
    tags[j] = tmp;
  }
}

function getRandomColor(isBlackWhite) {
  let v = isBlackWhite
    ? Math.round(Math.random() * 50 + 50)
    : Math.random() * 360;
    
  let wtf = isBlackWhite
    ? `hsl(34, ${v}%, 50%)` // `rgb(${v}, ${v}, ${v})`
    : `hsl(${v}, 40%, 50%)`;
  return wtf;
}
