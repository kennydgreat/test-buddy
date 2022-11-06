import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../ngrx-store/app-state';
import { selectHelperText } from '../ngrx-store/unit-study-state';

@Component({
  selector: 'app-testbuddy-helper',
  templateUrl: './testbuddy-helper.component.html',
  styleUrls: ['./testbuddy-helper.component.scss']
})
export class TestbuddyHelperComponent implements OnInit {

  @Input() text: Observable<string>;
  constructor(public store: Store<AppState>) {

    //initiate helper text observable
    this.text = this.store.select(selectHelperText);
   }

  ngOnInit(): void {
  }

}
