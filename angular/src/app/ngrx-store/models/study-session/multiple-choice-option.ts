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
  /**
   * Toggle the chosen flag and state between "chosen" and "default"
   */
  toggleChosen() {
    this.chosen = !this.chosen;
    this.state = this.chosen ? "chosen" : "default";
  }
  /**
   * Return option position
   * @returns number
   */
  getOption(): number {
    return this.index + 1;
  }

}

// Represents the states of a multiple choice option
export type OptionState = "wrong" | "correct" | "missed" | "wrong-position" | "default" | "chosen";