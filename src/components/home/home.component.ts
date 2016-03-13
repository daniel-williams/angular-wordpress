import {Component} from 'angular2/core';

@Component({
    selector: 'home',
    template: require('./home.component.html'),
    styles: [require('./home.component.scss')]
})
export class HomeComponent {
  title:string = 'Me mighty home component!';
}