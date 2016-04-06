import {Component, OnInit, OnDestroy, Input} from 'angular2/core';


@Component({
  selector: 'fetching',
  template: require('./fetching.component.html'),
  styles: [require('./fetching.component.scss')],
})
export class FetchingComponent implements OnInit, OnDestroy {
  @Input() label: string = 'loading';
  @Input() count: number = 5;
  @Input() interval: number = 200;
  
  private timer: any = null;
  private idx: number = -1;
  private BOXES_INITIAL: Array<boolean> = new Array(this.count).fill(false); 
  private boxes: Array<boolean>;
  
  constructor() { }

  ngOnInit() {
    this.timer = setInterval(() => {
      var n = this.idx + 1;
      if(n === this.count) { n = 0; }
      this.boxes = this.BOXES_INITIAL.slice();
      this.boxes[n] = true;
      this.idx = n;
    }, this.interval);
  }
  ngOnDestroy() {
    if(this.timer !== null) {
      clearInterval(this.timer);
    }
  }

}
