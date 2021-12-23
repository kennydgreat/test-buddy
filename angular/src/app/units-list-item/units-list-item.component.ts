import { Component, Input, OnInit } from '@angular/core';
import { Unit } from '../ngrx-store/models/unit';

@Component({
  selector: 'app-units-list-item',
  templateUrl: './units-list-item.component.html',
  styleUrls: ['./units-list-item.component.scss']
})
export class UnitsListItemComponent implements OnInit {

  @Input() unit: Unit
  constructor() { }

  ngOnInit(): void {
  }

}
