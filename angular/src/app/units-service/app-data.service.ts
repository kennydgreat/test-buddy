import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Observer, Subject } from 'rxjs';
import { multicast } from 'rxjs/operators';
import { Unit } from '../ngrx-store/models/unit';
import { UnitHelper } from '../ngrx-store/unit-helper';
import { AppState, UnitDictionary } from '../ngrx-store/units.state';
import {getFileHandle, readFile, verifyPermission, writeFile} from '../fs-helpers'
import { updateUnit, updateUnitsWithFileData } from '../ngrx-store/unit.reducer';

@Injectable({
  providedIn: 'root'
})

//Responible for getting and saving app data in local storage
export class AppDataService {
  // units helper 
  unitHelper: UnitHelper = new UnitHelper();
  
  // App data file handle
  fileHandle: any;
  // app state observable
  appData$: Observable<AppState>;
  
  constructor(private store: Store<AppState>) {
    
    // get the app state and subscribe to state changes
    this.appData$ = store.select(state => state);
    this.appData$.subscribe(
      {
        // save the data to file 
        next:(data: AppState) =>{
          this.saveAppDataInFile(data);
        }
      }
    );
   }

/**
 * Get file handle for data file
 * @return {Void} 
 */
 async setFileHandle() {
  try{
    [this.fileHandle] = await getFileHandle();
  }
  catch(err){
    this.reportError(`error getting data file handle- > ${err}`);
  }
}

/**
 * Get data from file and updates redux store with data
 * @return {Void} 
 */

async updateStore() {
  // set the file handle, this is where user picks file
  await this.setFileHandle();
  const appData = await this.getDataFromFile();
  this.store.dispatch(updateUnitsWithFileData({units: appData.units.unitsDictionary}));

}

/**
 * Saves app data in file
 * @param {AppState} appData
 * @return {Void} 
 */

async saveAppDataInFile(appData: AppState){
  if(! (await this.appDataFileReady())){
    return;
  }

  try{
    // write data to file
    writeFile(this.fileHandle, JSON.stringify(appData));
  }
  catch(err){
    this.reportError(`Error while trying to save app data on file -> ${err}`);
  }
}

/**
 * gets data from app data file
 * @return {AppState} App data as app state object.
 */
getDataFromFile = async () : Promise<AppState | undefined> => {
    let dataFileReadyForReading = await this.appDataFileReady();

    if(!dataFileReadyForReading){
      return undefined;
    }
    // read data and return data as appstate object
    try{
      let file = await this.fileHandle.getFile();
      let jsonString = await readFile(file);
      return JSON.parse(jsonString as string) as AppState;
    }
    catch(err){
      this.reportError(`Error while reading app data file -> ${err}`);
      return undefined;
    }

}


  //gets units 
  getUnits(){
    var unit = this.unitHelper.createNewUnit();
    unit.name = "Subject";
    var units = {};
    units[unit.id] = unit;
    return new Observable<UnitDictionary>( (observer) => {
      observer.next(units);
    });

  }

/**
 * checks if app data file ready for reading and writing
 * @return {Promise<boolean>} Handle to the new file.
 */
  private async appDataFileReady() : Promise<boolean>{
    if (!this.fileHandle){
      // the file handle is not set,
      this.reportError("File handle not set!");
      return false;
    }
    // check that the handle is of a file and not a directory
    if (this.fileHandle.kind.toLowerCase() !== 'file'){
      this.reportError(`file handle kind is of "${this.fileHandle.kind}" not file`);
      return false;
    }

    // check if app has permission to read from file
    let appHasFileAccess = await verifyPermission(this.fileHandle, true);
    if(!appHasFileAccess){
      this.reportError("App does not have read permission for app data file!");
      return false;
    }
    return true;
  }

  private reportError(error: string){
    console.error(`${AppDataService.name}: ${error}`);
  }

}
