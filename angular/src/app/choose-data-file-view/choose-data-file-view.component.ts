import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../units-service/app-data.service';

@Component({
  selector: 'app-choose-data-file-view',
  templateUrl: './choose-data-file-view.component.html',
  styleUrls: ['./choose-data-file-view.component.scss']
})
export class ChooseDataFileViewComponent implements OnInit {

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
  }

  getFile(){
    this.appDataService.updateStore();
  }

}
