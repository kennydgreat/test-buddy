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

  ngOnInit(): void {
  }

}
