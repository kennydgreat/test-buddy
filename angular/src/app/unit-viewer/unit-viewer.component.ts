import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnitStateful } from '../ngrx-store/models/unit-stateful';

@Component({
  selector: 'app-unit-viewer',
  templateUrl: './unit-viewer.component.html',
  styleUrls: ['./unit-viewer.component.scss'],
  animations:[
    // the animation for added root concepts, the view is fades in
    trigger('scaleUpRightEnter', [
      // the transition for inserted concept viewer, which makes the view fade in
      transition(':enter', [
        style({
          opacity: 0,
        }),
        animate('100ms', style({
          opacity: 1,
        }))
      ])
    ])
  ]
})
export class UnitViewerComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<void>();
  @Output() doneEvent = new EventEmitter<void>();
  @Input() unit : UnitStateful

  constructor() {
    
   }

  ngOnInit(): void {
  }

  // user clicked close button
  close(){
    // emit closeEvent to parent
   this.closeEvent.emit();
  }

  //adding a concept
  addConcept(){
    // add a new concept
    this.unit.addNewRootConcept();

    // save the change in the store
    this.unit.updateUnitInStore()
  }

  //saves unit in store 
  unitDetailsChange(){
    // save the change in the store by creating a new unit.
    this.unit.updateUnitInStore();
  }

  conceptChanged(){
    //concept changed, update unit in store
    this.unit.updateUnitInStore();
  }

  // user click done button
  done(){
    // emit done Event to parent
  this.doneEvent.emit();

  }

}
