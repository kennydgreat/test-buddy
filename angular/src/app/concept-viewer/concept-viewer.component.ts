import { Component, Input, OnInit } from '@angular/core';
import { Concept } from '../ngrx-store/models/concept';

@Component({
  selector: 'app-concept-viewer',
  templateUrl: './concept-viewer.component.html',
  styleUrls: ['./concept-viewer.component.scss']
})
export class ConceptViewerComponent implements OnInit {

  @Input() concept : Concept
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
    console.log(`isHover is ${isHover}`);
    this.setExpandVaraible();
    

  }
  /**
   * sets the onFocus varaible and triggers the expand logic
   * @param  {boolean} onFocus whether view in focus
   */
  onFocus(onFocus: boolean){
    this.anInputInfocus = onFocus;
    console.log(`onFocus is ${onFocus}`);
    this.setExpandVaraible();
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

}
