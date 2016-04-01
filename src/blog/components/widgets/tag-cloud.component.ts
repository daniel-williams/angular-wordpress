import { Component, Input } from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {ITag} from '../../models';


@Component({
  selector: 'tag-cloud',
  template: require('./tag-cloud.component.html'),
  styles: [require('./tag-cloud.component.scss')],
  directives: [ROUTER_DIRECTIVES]
})
export class TagCloudComponent {
  @Input() tags: ITag[];
  
  constructor() { }

}