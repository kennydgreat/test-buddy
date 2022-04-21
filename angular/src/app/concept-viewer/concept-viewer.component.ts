import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ConceptStateful } from '../ngrx-store/models/concept-stateful';

declare var LeaderLine: any;
@Component({
  selector: 'app-concept-viewer',
  templateUrl: './concept-viewer.component.html',
  styleUrls: ['./concept-viewer.component.scss']
})


export class ConceptViewerComponent implements OnInit {

  
  @Input() statefulConcept : ConceptStateful;
  @Output() conceptChangeEvent = new EventEmitter<void>();

  @ViewChildren('connectionPoint',{read: ElementRef}) connectionPoints:QueryList<ElementRef>;

  @ViewChildren('leader-line',{read: ElementRef}) leaderLines:QueryList<ElementRef>;
  constructor() { }

  conceptCPElem : ElementRef;

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

  ngAfterViewInit(): void {
    this.connectionPoints.changes.subscribe((r) => {
      //Draw connection lines
        this.drawLines();
    });

    this.leaderLines.changes.subscribe(()=>{
      // makes lines visible
      this.makeLinesVisible()
    });
  }

  drawLines(){
    // get ids of subconcepts
    var ids: Array<string> = this.statefulConcept.subconcepts.map(subconcept => subconcept.id);

    
    for(var i = 0; i < this.connectionPoints.length; i++){
      var currentElement = this.connectionPoints.get(i);
      if (currentElement.nativeElement != null){
        // look for the current concept connection point
        if (currentElement.nativeElement.id == this.statefulConcept.id){
          this.conceptCPElem = currentElement;
        }

        // check that current element is one of the subconcepts and element for the current concept connection point is set
        if (ids.includes(currentElement.nativeElement.id) && this.conceptCPElem != undefined){
          // create a line from the two connection points
        var line =  new LeaderLine(this.conceptCPElem.nativeElement,currentElement.nativeElement, {color: 'red', size: 8});

        
        line;
        }
      }
    }
  }

  makeLinesVisible(){
    if(this.conceptCPElem != undefined){
      
      for (var i = 0; i < this.leaderLines.length; i++){
        var currentLineElem = this.leaderLines.get(i);

        if(currentLineElem.nativeElement != null){
          // add line as a child of concept 
          this.conceptCPElem.nativeElement.appendChild(currentLineElem.nativeElement)
        }
      }
    }
  }
}
