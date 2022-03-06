import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AppDataService } from '../app-data-service/app-data.service';

@Component({
  selector: 'app-choose-data-file-view',
  templateUrl: './choose-data-file-view.component.html',
  styleUrls: ['./choose-data-file-view.component.scss']
})
export class ChooseDataFileViewComponent implements OnInit {

  constructor(private appDataService: AppDataService, private dialogRef: MatDialogRef<ChooseDataFileViewComponent>) { }

  ngOnInit(): void {
  }

  async getFile(){
    //try to update 
     await this.appDataService.updateStore();
     this.dialogRef.close();
     
  }

}
