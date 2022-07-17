import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ss-concept-progress-dot',
  templateUrl: './ss-concept-progress-dot.component.html',
  styleUrls: ['./ss-concept-progress-dot.component.scss']
})
export class SsConceptProgressDotComponent implements OnInit {

  // the status of the 
  @Input() status: "undone" | "done" | "doing";
  constructor() { }

  ngOnInit(): void {
  }

}
