import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-testbuddy-helper',
  templateUrl: './testbuddy-helper.component.html',
  styleUrls: ['./testbuddy-helper.component.scss']
})
export class TestbuddyHelperComponent implements OnInit {

  @Input() text: string
  constructor() { }

  ngOnInit(): void {
  }

}
