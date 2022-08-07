import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../ngrx-store/app-state';
import { Error } from '../ngrx-store/models/error-message';
import { hideError } from '../ngrx-store/reducers/unit.reducer';

@Component({
  selector: 'app-error-message-view',
  templateUrl: './error-message-view.component.html',
  styleUrls: ['./error-message-view.component.scss']
})
export class ErrorMessageViewComponent implements OnInit {
  @Input() error: Error
  constructor(private store: Store<AppState>) { 
  }

  ngOnInit(): void {
  }

  hideError(){
    this.store.dispatch(hideError(this.error.id));
  }

}
