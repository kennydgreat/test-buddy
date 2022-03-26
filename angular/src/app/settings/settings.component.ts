import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppDataService } from '../app-data-service/app-data.service';
import { AppState } from '../ngrx-store/app-state';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  //settings stream
  $dataFileName: Observable<string>
  constructor(private store: Store<AppState>, private appDataService: AppDataService) {
    this.$dataFileName = this.store.select(state => state.settings.dataFileName);
   }

  ngOnInit(): void {
  }

  async getFile() {
      //gets file and try to update app data file with file
      await this.appDataService.updateStore();

  }

}
