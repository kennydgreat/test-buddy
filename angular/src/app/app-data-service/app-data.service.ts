import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {getFileHandle, readFile, verifyPermission, writeFile} from '../fs-helpers'
import { reportError, updateUnitsWithFileData } from '../ngrx-store/unit.reducer';
import { AppState } from '../ngrx-store/app-state';
import { updateDataFileName } from '../ngrx-store/settings.reducer';

@Injectable({
  providedIn: 'root'
})

//Responible for getting and saving app data in local storage
export class AppDataService {
  
  // App data file handle
  fileHandle: any;
  // app state observable
  appData$: Observable<AppState>;

  // flag saying user has tried choosing a json file
  userChoseFile = false;
  
  constructor(private store: Store<AppState>) {
    
    // get the app state and subscribe to state changes
    this.appData$ = store.select(state => state);
    this.appData$.subscribe(
      {
        // save the data to file 
        next:(data: AppState) =>{
          // check that the user has attempted to pick a file once, this is also the app does not try saving the data till user tried to pick a file
          if(this.userChoseFile){
            this.saveAppDataInFile(data);
          }
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
    // update data file name
    this.store.dispatch(updateDataFileName(this.fileHandle.name));
  }
  catch(err){
    //catches the case where user cancels updating data file when app already has data
    if (this.fileHandle && (`${err}`).includes("AbortError")){
      return ;
    }
    this.showGenericError(`error getting data file handle- > ${err}`);
  }
}

/**
 * Get data from file and updates redux store with data
 * @return {Void} 
 */

async updateStore() {
 
  // set the file handle, this is where user picks file
  await this.setFileHandle();
   // this signifies that the user has tried to pick a file
   this.userChoseFile = true;
  
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
    this.showGenericError(`Error while trying to save app data on file -> ${err}`);
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
      this.showGenericError(`Error while reading app data file -> ${err}`);
      return undefined;
    }

}


/**
 * checks if app data file ready for reading and writing
 * @return {Promise<boolean>} Handle to the new file.
 */
  private async appDataFileReady() : Promise<boolean>{
    if (!this.fileHandle){
      // the file handle is not set,
      this.showGenericError("File handle not set! Try choosing file again in \"Settings\".");
      return false;
    }
    // check that the handle is of a file and not a directory
    if (this.fileHandle.kind.toLowerCase() !== 'file'){
      //this.logError(`file handle kind is of "${this.fileHandle.kind}" not file`);
      this.showGenericError(`file handle kind is of "${this.fileHandle.kind}" not file`);
      return false;
    }

    // check if app has permission to read from file
    let appHasFileAccess = await verifyPermission(this.fileHandle, true);
    if(!appHasFileAccess){
      this.showGenericError("App does not have read permission for app data file!");
      return false;
    }
    return true;
  }

  /**
   * Dispatches the no data file error
   */
  showNoDataFileError(){
    this.store.dispatch(reportError("No Data File!", `Your user data is currently not being saved. To ensure you don’t lose your data (units, perefences...) go to “${'Settings'.bold()}” and choose a data file.`));
  }
  /**
   * Dipatches a generic error
   * @param  {string} error error to show
   */
  showGenericError(error: string){
    this.store.dispatch(reportError("Something went wrong!", `${AppDataService.name}: ${error}`));
  }

  /**
   * Indicates that user dialog for choosing a file is closed, shows an error if the user did not pick a data file
   */
  userChooseFileDialogClosed(){
    if (!this.userChoseFile){
      this.showNoDataFileError();
    }
  }
  /**
   * Checks if app has a storage file
   * @returns boolean
   */
  appHasDataFile() : boolean{
    return (this.fileHandle != undefined);
  }

}
