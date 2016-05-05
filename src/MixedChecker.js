// LICENSE : MIT
"use strict";
import {analyze, isDearu, isDesumasu} from "analyze-desumasu-dearu";
export default class MixedChecker {
    /**
     * @param context
     */
    constructor(context) {
        this.context = context;
        this.dearuCount = 0;
        this.desumasuCount = 0;
        this.dearuLastHit = null;
        this.desumasuLastHit = null;
        this._queue = Promise.resolve();
    }

    check(node, text) {
        this._queue = this._queue.then(() => {
            return analyze(text).then(results => {
                const retDearu = results.filter(isDearu);
                const retDesumasu = results.filter(isDesumasu);
                const dearuCount = this.dearuCount + retDearu.length;
                const desumasuCount = this.desumasuCount + retDesumasu.length;
                if (this.dearuCount !== dearuCount) {
                    this.dearuCount = dearuCount;
                    this.dearuLastHit = {
                        node,
                        matches: retDearu
                    };
                }
                if (this.desumasuCount !== desumasuCount) {
                    this.desumasuCount = desumasuCount;
                    this.desumasuLastHit = {
                        node,
                        matches: retDesumasu
                    };
                }
            });
        });
    }

    checkout() {
        return this._queue.then(() => {
            if (!this.isOver()) {
                return;
            }
            const RuleError = this.context.RuleError;
            const report = this.context.report;
            const lastHitNode = this.lastHitNode;
            const lastHitToken = this.lastHitToken;
            const ruleError = new RuleError(this.outputMessage() , {
                index: lastHitToken.index
            });
            report(lastHitNode, ruleError)
        });
    }

    isOver() {
        return this.dearuCount !== 0 && this.desumasuCount !== 0;
    }

    getOverType() {
        if (this.dearuCount > this.desumasuCount) {
            return "である";
        } else {
            return "ですます";
        }
    }

    get lastHitNode() {
        const overType = this.getOverType();
        if (overType === "である") {
            return this.desumasuLastHit.node;
        } else if (overType === "ですます") {
            return this.dearuLastHit.node;
        }
    }
    get lastHitToken() {
        const overType = this.getOverType();
        if (overType === "である") {
            return this.desumasuLastHit.matches[0];
        } else if (overType === "ですます") {
            return this.dearuLastHit.matches[0];
        }
    }

    outputMessage() {
        const overType = this.getOverType();
        const hitToken = this.lastHitToken;
        if (overType === "である") {
            // である優先 => 最後の"ですます"を表示
            return `"である"調 と "ですます"調 が混在
=> "${hitToken.value}" がですます調
Total:
である  : ${this.dearuCount}
ですます: ${this.desumasuCount}
`;
        } else if (overType === "ですます") {
            // ですます優先 => 最後の"である"を表示
            return `"である"調 と "ですます"調 が混在
=> "${hitToken.value}" がである調
Total:
である  : ${this.dearuCount}
ですます: ${this.desumasuCount}
`;
        }
    }
}
