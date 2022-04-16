import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConceptStateless } from '../ngrx-store/models/concept-stateless';

@Component({
  selector: 'app-concept-viewer',
  templateUrl: './concept-viewer.component.html',
  styleUrls: ['./concept-viewer.component.scss']
})
export class ConceptViewerComponent implements OnInit {

  @Input() statelessConcept : ConceptStateless;
  @Output() conceptChangeEvent = new EventEmitter<void>();
  // state concept variable that can be safely changed
  editableConcept : ConceptStateless;
  constructor() { }

  showConceptExpandedCard = false;
  anInputInfocus = false;
  isHover = false
  ngOnInit(): void {
    // set the stateful concept to data from statless concept passed in
    this.editableConcept = {...this.statelessConcept};
  }
  /**
   * sets the onHover varaible and triggers the expand logic 
   * @param  {boolean} isHover whether the view is being hovered
   */
  onHover(isHover: boolean){
    this.isHover = isHover;
    console.log(`isHover is ${isHover}`);
    this.setExpandVaraible();
    

  }
  /**
   * sets the onFocus varaible, triggers the expand logic, change concept and triggers concept change event
   * @param  {boolean} onFocus whether view in focus
   */
  onFocus(onFocus: boolean){
    this.anInputInfocus = onFocus;
    console.log(`onFocus is ${onFocus}`);
    this.setExpandVaraible();
    if(!onFocus){
      // this means the user might be done making a change, update stateless concept safely and emit concept change event
      this.statelessConcept = {...this.editableConcept};
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
    // update stateless concept and emit concept change event
    this.statelessConcept = {...this.editableConcept};
    this.conceptChangeEvent.emit();

  }

}
