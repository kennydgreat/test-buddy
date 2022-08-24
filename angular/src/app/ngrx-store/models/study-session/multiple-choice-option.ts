export class Option {
  text: string;
  isAnwser: boolean;
  chosen: boolean;
  state: OptionState
  // for when option represents a subconcept 
  conceptID: string;


  constructor(text: string, isAnwser: boolean, conceptId = "") {
    this.text = text;
    this.isAnwser = isAnwser;
    this.chosen = false;
    this.state = "default";
    this.conceptID = conceptId;
  }

  toggleChosen() {
    this.chosen = !this.chosen;
    this.state = this.chosen ? "chosen" : "default";
  }

}

// Represents the states of a multiple choice option
export type OptionState = "wrong" | "correct" | "missed" | "wrong-position" | "default" | "chosen";