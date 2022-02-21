import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Observer, Subject } from 'rxjs';
import { multicast } from 'rxjs/operators';
import { Unit } from '../ngrx-store/models/unit';
import { UnitHelper } from '../ngrx-store/unit-helper';
import { AppState, UnitDictionary } from '../ngrx-store/units.state';
import {getFileHandle, readFile, verifyPermission, writeFile} from '../fs-helpers'

@Injectable({
  providedIn: 'root'
})

//Responible for getting and saving app data in local storage
export class AppDataService {
  // units helper 
  unitHelper: UnitHelper = new UnitHelper();
  
  // App data file handle
  fileHandle: any;
  unitsDictionary: UnitDictionary = {};
  // units multicast observable, emits the current units dictionary as an array of units to all observers
  $units: Subject<Unit[]> = new Subject<Unit[]>();
  appData$: Observable<AppState>;
  
  constructor(private store: Store<AppState>) {
    //Add a unit to the unitDictionary
    var unit = this.unitHelper.createNewUnit();
    unit.name = "Subject";
    this.unitsDictionary[unit.id] = unit;
    this.$units.next(Object.values(this.unitsDictionary));

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

// sets the file Handle 
setFileHandle = async () => {
  try{
    [this.fileHandle] = await getFileHandle();
  }
  catch(err){
    this.reportError("error getting data file handle");
  }
}


/**
 * Saves app data in file
 * @param {AppState} appData
 * @return {Void} Handle to the new file.
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

  // Units data multicast subscriber function, subscribes an observer to the observable created with this function
  multicastUnitsSubscriber(){
    // keep track of each observers
    const observers : Observer<Unit[]>[] = [];

    // the subscribe function
    return (observer: Observer<Unit[]>) => {
      // add observer to the list of observers
      observers.push(observer);

      if(observers.length === 1){
        // this the first subscription, create the multicast observer

        const multicastObserver: Observer<Unit[]> = {
          next(units: Unit[]) {
            // iterate through the observers and notify all subscriptions
            observers.forEach(obs => obs.next(units));
          },
          error(){},
          complete(){}
        };
        // function that turns units dictionary into  array (exploses units)
        this.returnUnitsArray(multicastObserver);
      }
     
      // return a subscription object which has a unsubcribe function which removes the observer from the observer array 
      return {
        unsubscribe(){
          observers.splice(observers.indexOf(observer), 1);
        }
      }

    }
    
  }

  // exposes units dictionary values to observer as  array
  returnUnitsArray(unitsObserver: Observer<Unit[]>){
    unitsObserver.next(Object.values(this.unitsDictionary));
  }

  updateUnit(unit: Unit){
    this.unitsDictionary[unit.id] = unit;
  
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
