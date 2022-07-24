import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ss-concept-option-box',
  templateUrl: './ss-concept-option-box.component.html',
  styleUrls: ['./ss-concept-option-box.component.scss']
})
export class SsConceptOptionBoxComponent implements OnInit {

  // the component's states
  @Input() state: "wrong" | "correct" | "missed" | "wrong-position" | "default";

  @Input() text: string;

  constructor() { }

  ngOnInit(): void {
  }

}
