export class Option {
  text: string;
  isAnwser: boolean;
  chosen: boolean;
  state: OptionState
  // for when option represents a subconcept 
  conceptID: string;
  //for when the order needs to be validated
  index: number;


  constructor(text: string, isAnwser = false, conceptId = "", index = 0) {
    this.text = text;
    this.isAnwser = isAnwser;
    this.chosen = false;
    this.state = "default";
    this.conceptID = conceptId;
    this.index = index;
  }

  toggleChosen() {
    this.chosen = !this.chosen;
    this.state = this.chosen ? "chosen" : "default";
  }

}

// Represents the states of a multiple choice option
export type OptionState = "wrong" | "correct" | "missed" | "wrong-position" | "default" | "chosen";