import { Component, OnInit, EventEmitter } from 'angular2/core';


@Component({
  selector: 'pager',
  template: require('./pager.component.html'),
  styles: [require('./pager.component.scss')],
  inputs: ['status', 'isFirst', 'isLast'],
  outputs: ['onPrevious', 'onNext'],
})
export class PagerComponent implements OnInit {
  
  isFirst: boolean = false;
  isLast: boolean = false;
  onPrevious: EventEmitter<any> = new EventEmitter();
  onNext: EventEmitter<any> = new EventEmitter();
  prevBtnClasses: any = {};
  nextBtnClasses: any = {};
  
  constructor() {}
  
  ngOnInit() {
    this.prevBtnClasses = {
      'disabled': this.isFirst,
      'btn-primary': !this.isFirst,
      'btn-default': this.isFirst,
    }
    this.nextBtnClasses = {
      'disabled': this.isLast,
      'btn-primary': !this.isLast,
      'btn-default': this.isLast,
    }
  }

  prevClick(event) {
    console.log('pager previous click');
    this.onPrevious.emit(event);
  }
  
  nextClick(event) {
    console.log('pager next click');
    this.onNext.emit(event);
  }
}