import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../ngrx-store/app-state';
import { selectCurrentConceptProgress, SSConceptProgressDictionary, SSConcpetProgress, UIConceptProgress } from '../ngrx-store/unit-study-state';

@Component({
  selector: 'app-ss-concept-progress',
  templateUrl: './ss-concept-progress.component.html',
  styleUrls: ['./ss-concept-progress.component.scss']
})
export class SsConceptProgressComponent implements OnInit {

  progress: UIConceptProgress;
  constructor(private store: Store<AppState>) {
    this.store.select(selectCurrentConceptProgress).subscribe(
      {
        next: (progress: UIConceptProgress) => {
          this.progress = progress;
        }
      }
    );
   }

  ngOnInit(): void {
  }

}
