import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../ngrx-store/app-state';
import { ConceptStateful } from '../ngrx-store/models/concept-stateful';

declare var LeaderLine: any;
@Component({
  selector: 'app-concept-viewer',
  templateUrl: './concept-viewer.component.html',
  styleUrls: ['./concept-viewer.component.scss']
})


export class ConceptViewerComponent implements OnInit {


  @Input() statefulConcept: ConceptStateful;
  @Output() conceptChangeEvent = new EventEmitter<void>();
  @Output() conceptDeleteEvent = new EventEmitter<ConceptStateful>();

  leaderLines = [];

  conceptCPElem: ElementRef;

  showConceptExpandedCard = false;
  anInputInfocus = false;
  isHover = false


  constructor() {
  
  }
  ngOnInit(): void {


  }
  /**
   * sets the onHover varaible and triggers the expand logic 
   * @param  {boolean} isHover whether the view is being hovered
   */
  onHover(isHover: boolean) {
    this.isHover = isHover;
    this.setExpandVaraibles();

  }

  /**
   * sets the onFocus varaible, triggers the expand logic, change concept and triggers concept change event
   * @param  {boolean} onFocus whether view in focus
   */
  onFocus(onFocus: boolean) {
    this.anInputInfocus = onFocus;
    this.setExpandVaraibles();
    if (!onFocus) {
      // this means the user might be done making a change, update stateless concept safely and emit concept change event
      this.conceptChangeEvent.emit();
    }
  }
  /**
   * Logic for expanding concept viewer
   */
  setExpandVaraibles() {
    if (this.isHover) {
      this.showConceptExpandedCard = true;
    } else {
      if (this.anInputInfocus) {
        this.showConceptExpandedCard = true;
      } else {
        this.showConceptExpandedCard = false;
      }
    }
  }

  // update concept and triggers concept change event
  toggleSubconceptOrdered() {
    // emit concept change event
    this.conceptChangeEvent.emit();

  }

  addSubconcept() {
    // add a new concept and emit concept change event
    this.statefulConcept.addsubconcept();
    this.conceptChangeEvent.emit();
  }

  extendSubConcept(subconcept: ConceptStateful) {
    // get the subconcept to extend itself and emit concept change event, this will event will pickup but the unit component futher up. 
    subconcept.addsubconcept();
    this.conceptChangeEvent.emit();
  }

  subconceptsDragDropEvent(event: CdkDragDrop<ConceptStateful[]>){
    // change the order of the elements
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    //update the stateful concept and emit change
    this.statefulConcept.subconcepts = event.container.data;
    this.conceptChangeEvent.emit();
  }

  deleteConcept(){
    // send event to the parent component to delete this concept. 
    this.conceptDeleteEvent.emit(this.statefulConcept);
  }

  deleteSubconcept(subconcept: ConceptStateful){
    
    // send event to parent component to delete subconcept
    this.conceptDeleteEvent.emit(subconcept);
  }

  deleteSubconceptEventReceived(subConcept: ConceptStateful){

    // the delete event received, propagate event up the tree to eventually reach the unit component.
    this.conceptDeleteEvent.emit(subConcept);
  }

  subconceptChanged(){

    // a subconcept changed event was received propagate event up the tree
    this.conceptChangeEvent.emit();
  }

}
