import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unit-delete-timer-item',
  templateUrl: './unit-delete-timer-item.component.html',
  styleUrls: ['./unit-delete-timer-item.component.scss']
})
export class UnitDeleteTimerItemComponent implements OnInit {

  counter = 100; 
  constructor() {

    let intervalID = setInterval(() => {
      this.counter = this.counter - 10 ;
      if (this.counter === 0){
        clearInterval(intervalID);
      }
    }, 1000);
   }

  ngOnInit(): void {
  }

}
