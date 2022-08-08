import { Option } from "./multiple-choice-option";

/**
 * Represents a Multiple choice question
 */
export class MultipleChoiceQuestion {
    questionText: string;
    options: Option[];
    hasMultipleAnwsers: boolean;
    right: boolean;
    marked: boolean;

    constructor(questionText: string, options: Option[], hasMultipleAnswers: boolean) {
      this.questionText = questionText;
      this.options = options;
      this.hasMultipleAnwsers = hasMultipleAnswers;
      this.right = false;
      this.marked = false;
    }
    
    /**
     * Marks the question 
     */
    markQuestion(){
        if (this.marked){
            return;
        }
        this.options.forEach((option) => {
            if (option.chosen) {
                // the right flag is whether the chosen is the answer
                this.right = option.isAnwser;
                // sets the state based on the whether the question is wrong or right
                option.state = this.right ? "correct" : "wrong"
            }else{
                // set state if anser is missed
                if (option.isAnwser){
                    option.state = "missed"
                }
            }
        });

        this.marked = true;
    }
}