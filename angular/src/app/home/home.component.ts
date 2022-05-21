import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChooseDataFileViewComponent } from '../choose-data-file-view/choose-data-file-view.component';
import { AppState, selectUnitsAsArray } from '../ngrx-store/app-state';
import { UnitStateless } from '../ngrx-store/models/unit-stateless';
import { AppDataService } from '../app-data-service/app-data.service';
import { CreateUnitViewComponent } from '../create-unit-view/create-unit-view.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //units stream
  units$: Observable<UnitStateless[]>
  units: UnitStateless[]

  
  constructor(private store: Store<AppState>, public createUnitDialog: MatDialog, public choseDataFileDialog: MatDialog, public appDataService: AppDataService) {
    //connect units stream to units from units state
    this.units$ = this.store.select(selectUnitsAsArray);
    
   }

  ngOnInit(): void {
    // open choose data file dialog
    if(!this.appDataService.appHasDataFile()){
      this.openChooseDataFileDialog();
    }
  }

  //opens the create unit dialog
  openCreateUnitDialog(): void{
    const createUnitdialogRef = this.createUnitDialog.open(CreateUnitViewComponent,{
      // to make dialog full-screen
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: `100%`,
      height: `100%`,
      hasBackdrop: false,
      panelClass: 'full-screen-dialog',
      disableClose: true
    });

  }

  openChooseDataFileDialog(): void{
    const chooseDataFileDialogRef = this.choseDataFileDialog.open(ChooseDataFileViewComponent);

    chooseDataFileDialogRef.afterClosed().subscribe(()=>{
      this.appDataService.userChooseFileDialogClosed();
    });

  }

}
