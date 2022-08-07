import { Option } from "./multiple-choice-option";

/**
 * Represents a Multiple choice question
 */
export class MultipleChoiceQuestion {
    questionText: string;
    options: Option[];
    hasMultipleAnwsers: boolean;

    constructor(questionText: string, options: Option[], hasMultipleAnswers: boolean) {
      this.questionText = questionText;
      this.options = options;
      this.hasMultipleAnwsers = hasMultipleAnswers;
    }
}