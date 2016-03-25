import {Component, OnInit} from 'angular2/core';


@Component({
    selector: 'about',
    template: require('./about.component.html'),
    styles: [require('./about.component.scss')],
    providers: []
})
export class AboutComponent implements OnInit {
  test: string = 'How about that about component.'
  
  constructor() {
  }
  
  ngOnInit() {
  }
}