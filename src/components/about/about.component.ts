import {Component} from 'angular2/core';

@Component({
    selector: 'about',
    template: require('./about.component.html'),
    styles: [require('./about.component.scss')]
})
export class AboutComponent {
  test: string = 'How about that about component.'
}