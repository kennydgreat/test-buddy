import { Component, Input, OnInit } from '@angular/core';
import { UnitStateless } from '../ngrx-store/models/unit-stateless';

@Component({
  selector: 'app-units-list-item',
  templateUrl: './units-list-item.component.html',
  styleUrls: ['./units-list-item.component.scss']
})
export class UnitsListItemComponent implements OnInit {

  @Input() unit: UnitStateless
  constructor() { }

  ngOnInit(): void {
  }

}
