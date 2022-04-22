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

  defaultStateCP_ID: string = '';
  expandedStateCP_ID: string = '';


  CONCEPT_CP_ID = "concept-CP";
  SUB_CONCEPT_CP_ID = "subconcept-CP";

  @ViewChildren('connectionPoint', { read: ElementRef }) connectionPoints: QueryList<ElementRef>;

  leaderLines = [];

  subscription: Subscription


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
    // set the connection point id varaible, this dictates where the connection is draw from
    this.defaultStateCP_ID = this.showConceptExpandedCard ? "" : this.CONCEPT_CP_ID;
    this.expandedStateCP_ID = this.showConceptExpandedCard ? this.CONCEPT_CP_ID : "";

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

  ngAfterViewInit(): void {

    this.subscription = this.connectionPoints.changes.subscribe((r) => {
      //Draw connection lines
      //this.drawLines();
    });

  }

  ngOnDestroy() {
    //unsubscribe to connection point selector subscription
    if (this.addSubconcept != undefined) {
      this.subscription.unsubscribe();
    }
    this.removeLines();
  }

  drawLines() {

    //remove lines
    this.removeLines();

    if (this.connectionPoints == undefined) {
      // the connectionPoints are not undefined so return
      return;
    }

    for (var i = 0; i < this.connectionPoints.length; i++) {
      var currentElement = this.connectionPoints.get(i);
      if (currentElement.nativeElement != null) {
        // look for the current concept connection point
        if (currentElement.nativeElement.id == this.CONCEPT_CP_ID) {
          this.conceptCPElem = currentElement;
        }

        // check that current element is one of the subconcepts and the element for the current concept connection point is set
        if (currentElement.nativeElement.id == this.SUB_CONCEPT_CP_ID && this.conceptCPElem != undefined) {
          // create a line from the two connection points
          var line = new LeaderLine(this.conceptCPElem.nativeElement, LeaderLine.pointAnchor(currentElement.nativeElement, {
            x: -10,
            y: 0
          }));

          this.leaderLines.push(line);

        }
      }
    }
  }

  removeLines() {
    //remove old lines
    this.leaderLines.forEach((line) => {
      line.remove()
    });
    this.leaderLines = [];
  }
}
