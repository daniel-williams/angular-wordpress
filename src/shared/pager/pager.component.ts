import {Component, OnInit, EventEmitter, Input, Output} from 'angular2/core';


@Component({
  selector: 'pager',
  template: require('./pager.component.html'),
  styles: [require('./pager.component.scss')],
})
export class PagerComponent implements OnInit {
  @Input() status: string;
  @Input() isFirst: boolean = false;
  @Input() isLast: boolean = false;
  
  @Output() onPrevious: EventEmitter<any> = new EventEmitter();
  @Output() onNext: EventEmitter<any> = new EventEmitter();
  
  private prevBtnClasses: any = {};
  private nextBtnClasses: any = {};
  
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
    this.onPrevious.emit(event);
  }
  
  nextClick(event) {
    this.onNext.emit(event);
  }
}