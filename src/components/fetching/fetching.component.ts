import {Component, OnInit, OnDestroy} from 'angular2/core';


@Component({
  selector: 'fetching',
  template: require('./fetching.component.html'),
  styles: [require('./fetching.component.scss')],
  inputs: ['label', 'count', 'interval']
})
export class FetchingComponent implements OnInit, OnDestroy {
  
  label: string = 'loading';
  timer: any = null;
  interval: number = 200;
  idx: number = -1;
  count: number = 5;
  boxes: Array<boolean> = new Array(this.count).fill(false);
  
  constructor() { }

  ngOnInit() {
    this.timer = setInterval(() => {
      var n = this.idx + 1;
      if(n === this.count) { n = 0; }
      this.boxes = new Array(this.count).fill(false);
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

class Box {
  on: boolean = false
}