import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, selectUnitsTobeDeletedList } from './ngrx-store/app-state';
import { UnitDeleteItem } from './ngrx-store/models/UnitDeleteItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {

  // stream of structure representing units to be deleted
  $unitsToBeDeletedItems: Observable<UnitDeleteItem[]>

  constructor(private store: Store<AppState>){
    this.$unitsToBeDeletedItems = this.store.select(selectUnitsTobeDeletedList);
  }
}
