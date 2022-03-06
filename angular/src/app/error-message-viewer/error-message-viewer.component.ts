import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, selectErrorMessages } from '../ngrx-store/app-state';
import { Error } from '../ngrx-store/models/error-message';

@Component({
  selector: 'app-error-message-viewer',
  templateUrl: './error-message-viewer.component.html',
  styleUrls: ['./error-message-viewer.component.scss']
})
export class ErrorMessageViewerComponent implements OnInit {

  //error messages observable stream
  errorMessages$ : Observable<Error[]>
  constructor(private store: Store<AppState>) { 
     // connect observable to error message list from store
     this.errorMessages$ = this.store.select(selectErrorMessages);
  }

  ngOnInit(): void {
   
  }

}
