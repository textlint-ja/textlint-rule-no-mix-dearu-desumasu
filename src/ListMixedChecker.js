// LICENSE : MIT
"use strict";
import MixedChecker from "./MixedChecker"
export default class ListMixedChecker extends MixedChecker {
    outputMessage() {
        return "箇条書き: " + super.outputMessage();
    }
}