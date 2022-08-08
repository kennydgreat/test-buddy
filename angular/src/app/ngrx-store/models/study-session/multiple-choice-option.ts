export class Option {
    text: string;
    isAnwser: boolean;
    chosen: boolean;
    state: OptionState
    

    constructor(text: string, isAnwser: boolean) {
      this.text = text;
      this.isAnwser = isAnwser;
      this.chosen = false;
      this.state = "default";
    }

}

// Represents the states of a multiple choice option
export type OptionState = "wrong" | "correct" | "missed" | "wrong-position" | "default";