import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../ngrx-store/app-state';
import { selectCurrentConceptProgress, UIConceptProgress } from '../ngrx-store/unit-study-state';

@Component({
  selector: 'app-ss-concept-progress',
  templateUrl: './ss-concept-progress.component.html',
  styleUrls: ['./ss-concept-progress.component.scss']
})
export class SsConceptProgressComponent implements OnInit {

  // subject observable to trigger unsubscribition
  private unsubscribe = new Subject<void>();
  progress: UIConceptProgress;
  constructor(private store: Store<AppState>) {

    this.store.select(selectCurrentConceptProgress).pipe(
      takeUntil(this.unsubscribe) // this ensures the subscription when the unsubscription subject is triggered

    ).subscribe(
      {
        next: (progress: UIConceptProgress) => {
          this.progress = progress;
        }
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // trigger unsubscribe subject and end it's values
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
