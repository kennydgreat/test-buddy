import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { EditUnitViewComponent } from '../edit-unit-view/edit-unit-view.component';
import { AppState } from '../ngrx-store/app-state';
import { UnitStateless } from '../ngrx-store/models/unit-stateless';
import { editUnit } from '../ngrx-store/unit.reducer';

@Component({
  selector: 'app-units-list-item',
  templateUrl: './units-list-item.component.html',
  styleUrls: ['./units-list-item.component.scss']
})
export class UnitsListItemComponent implements OnInit {

  @Input() unit: UnitStateless
  constructor(private store: Store<AppState>, private editUnitDialog:  MatDialog) { }

  ngOnInit(): void {
  }

  openEditUnit() {
    // dispatch edit unit action
    this.store.dispatch(editUnit(this.unit.id));
    const editUnitDialogRef = this.editUnitDialog.open(EditUnitViewComponent, {
      // to make dialog full-screen
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: `100%`,
      height: `100%`,
      hasBackdrop: false,
      panelClass: 'full-screen-dialog',
      disableClose: true
    })
  }
  
}
