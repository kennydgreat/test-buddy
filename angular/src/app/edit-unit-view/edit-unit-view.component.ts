import { Component, OnInit } from '@angular/core';
import { UnitStateful } from '../ngrx-store/models/unit-stateful';

@Component({
  selector: 'app-edit-unit-view',
  templateUrl: './edit-unit-view.component.html',
  styleUrls: ['./edit-unit-view.component.scss']
})
export class EditUnitViewComponent implements OnInit {

  unit: UnitStateful;

  constructor() { }

  ngOnInit(): void {
  }

}
