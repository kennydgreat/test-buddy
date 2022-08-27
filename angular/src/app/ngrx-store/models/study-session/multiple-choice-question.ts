import { Option } from "./multiple-choice-option";

/**
 * Represents a Multiple choice question
 */
export class MultipleChoiceQuestion {
    questionText: string;
    options: Option[];
    type: "single answer" | "multi-answer" | "ordered question";
    right: boolean;
    marked: boolean;

    constructor(questionText: string, options: Option[], type: MultipleChoiceQuestion["type"] = "single answer") {
        this.questionText = questionText;
        this.options = options;
        this.type = type;
        this.right = false;
        this.marked = false;
    }

    /**
     * Marks the question 
     */
    markQuestion() {
        if (this.marked) {
            return;
        }

        switch (this.type) {
            case "single answer":
                this.options.forEach((option) => {
                    if (option.chosen) {
                        // the right flag is whether the chosen is the answer
                        this.right = option.isAnwser;
                        // sets the state based on the whether the question is wrong or right
                        option.state = this.right ? "correct" : "wrong"
                    } else {
                        // set state if anser is missed
                        if (option.isAnwser) {
                            option.state = "missed"
                            this.right = false;
                        }
                    }
                });

                break;

            case "multi-answer":
                // question is right until it's proven to be wrong
                this.right = true;

                //go through all other options
                for (var i = 0; i < this.options.length; i++) {
                    // the option is an awnser but it's not chosen
                    if (this.options[i].isAnwser && !this.options[i].chosen) {
                        //the question is wrong.
                        this.right = false;
                        // the option was missed
                        this.options[i].state = "missed"
                    }
                    // the option was chosen and so far the question is right
                    if (this.options[i].chosen) {
                        // the question is right or wrong so far depending on whetehr the option is an anwser. if the question is wrong it can no longer be right
                        if (this.right) {
                            this.right = this.options[i].isAnwser;
                        }
                        // the option is wrong
                        this.options[i].state = this.options[i].isAnwser ? "correct" : "wrong"

                    }

                }
                break;

            case "ordered question":
                // question is right until it's proven to be wrong
                this.right = true;
                this.options.forEach((option: Option, index: number) => {

                    // only update the right flag if it's currently right
                    if (this.right) {
                        // the question is right so far if the option's index is the same as it's  postion in the array.
                        this.right = option.index === index;
                    }

                    // update the state
                    option.state = option.index === index ? "correct" : "wrong-position";
                });
                break;
        }



        this.marked = true;
    }

}