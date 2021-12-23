import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '../ngrx-store/models/unit';

@Injectable({
  providedIn: 'root'
})

//Responible for getting and saving app data in local storage
export class AppDataService {
  // units 
  units: Unit[] = [{name: "Subject" , numOfConcepts: 10, concepts: [], description: "", numOfRootConceptsWithDefiniton: 4, numOfRootConceptsWithSubconcepts: 5, id: "" }]
  constructor() { }

  //gets units 
  getUnits(){
    return new Observable<Unit[]>( (observer) => {
      observer.next([{name: "Subject" , numOfConcepts: 10, concepts: [], description: "", numOfRootConceptsWithDefiniton: 4, numOfRootConceptsWithSubconcepts: 5, id: "" }]);
    });
  }
}
