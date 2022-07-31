import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "../app-state";
import { selectUnitToStudyStateless } from "../unit-study-state";
import { UnitStateful } from "./unit-stateful";
import { UnitStateless } from "./unit-stateless";

export class UnitSS_Stateful{

    unit: UnitStateless;
    unitNameForStudySession: string



    constructor (public store: Store<AppState>){
       
    //use selector to get unit to study
    let $unit = this.store.select(selectUnitToStudyStateless);
    
    // subscribe to cahnges to the obserable to get the unit
    $unit.subscribe(

        {
            next: (unitFromStore: UnitStateless) =>{
                this.unit = unitFromStore;
                this.unitNameForStudySession = this.unit.name
            }
        }
    );

    }


    setNextQuestion(unit: UnitStateless){

    }
}