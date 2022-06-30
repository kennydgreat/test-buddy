import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UnitDeleteItem } from '../ngrx-store/models/UnitDeleteItem';
import { deleteUnit, removeFromUnitsToBeDeleted } from '../ngrx-store/unit.reducer';

@Component({
  selector: 'app-unit-delete-timer-item',
  templateUrl: './unit-delete-timer-item.component.html',
  styleUrls: ['./unit-delete-timer-item.component.scss']
})
export class UnitDeleteTimerItemComponent implements OnInit {

  @Input() unitToBeDeleteDItem: UnitDeleteItem;
  counter = 100; 
  intervalID
  constructor(private store: Store) {

    //start timer
    this.intervalID = setInterval(() => {
      this.counter = this.counter - 10 ;
      // clear timer when counter gets to 0
      if (this.counter === 0){
        // delete unit
        this.delete();
      }
    }, 1000);
   }

  ngOnInit(): void {
  }

  undo(){
    this.store.dispatch(removeFromUnitsToBeDeleted(this.unitToBeDeleteDItem));
  }

  delete(){
    this.store.dispatch(deleteUnit(this.unitToBeDeleteDItem.id));
  }

  ngOnDestroy() {
    // clear interval in case the component is destory before the timer ends
    clearInterval(this.intervalID);
  }

}
