import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConceptStateful } from '../ngrx-store/models/concept-stateful';

@Component({
  selector: 'app-concept-viewer',
  templateUrl: './concept-viewer.component.html',
  styleUrls: ['./concept-viewer.component.scss']
})
export class ConceptViewerComponent implements OnInit {

  @Input() statefulConcept : ConceptStateful;
  @Output() conceptChangeEvent = new EventEmitter<void>();
  // state concept variable that can be safely changed
  constructor() { }

  showConceptExpandedCard = false;
  anInputInfocus = false;
  isHover = false
  ngOnInit(): void {
    
  }
  /**
   * sets the onHover varaible and triggers the expand logic 
   * @param  {boolean} isHover whether the view is being hovered
   */
  onHover(isHover: boolean){
    this.isHover = isHover;
    this.setExpandVaraible();
    

  }
  /**
   * sets the onFocus varaible, triggers the expand logic, change concept and triggers concept change event
   * @param  {boolean} onFocus whether view in focus
   */
  onFocus(onFocus: boolean){
    this.anInputInfocus = onFocus;
    this.setExpandVaraible();
    if(!onFocus){
      // this means the user might be done making a change, update stateless concept safely and emit concept change event
      this.conceptChangeEvent.emit();
    }
  }
  /**
   * Logic for expanding concept viewer
   */
  setExpandVaraible(){
    if (this.isHover){
      this.showConceptExpandedCard = true;
    }else{
      if(this.anInputInfocus){
        this.showConceptExpandedCard = true;
      }else{
        this.showConceptExpandedCard = false;
      }
    }
  }

  // update concept and triggers concept change event
  toggleSubconceptOrdered(){
    // emit concept change event
    this.conceptChangeEvent.emit();

  }

  addSubconcept(){
    // add a new concept and emit concept change event
    this.statefulConcept.addsubconcept();
    this.conceptChangeEvent.emit();
  }

  extendSubConcept(subconcept: ConceptStateful) {
    // get the subconcept to extend itself and emit concept change event, this will event will pickup but the unit component futher up. 
    subconcept.addsubconcept();
    this.conceptChangeEvent.emit();
  }

}
