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
        this.dearuHitList = [];
        this.desumasuHitList = [];
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
                    this.dearuHitList.push({
                        node,
                        matches: retDearu
                    });
                }
                if (this.desumasuCount !== desumasuCount) {
                    this.desumasuCount = desumasuCount;
                    this.desumasuHitList.push({
                        node,
                        matches: retDesumasu
                    });
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
            const overHitList = this.overHitList;
            overHitList.forEach(({
                node,
                matches
            }) => {
                const lastHitNode = node;
                const lastHitToken = matches[0];
                const ruleError = new RuleError(this.outputMessage(lastHitToken), {
                    index: lastHitToken.index
                });
                report(lastHitNode, ruleError)
            });
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

    get overHitList() {
        const overType = this.getOverType();
        if (overType === "である") {
            return this.desumasuHitList;
        } else if (overType === "ですます") {
            return this.dearuHitList;
        }
    }

    outputMessage(token) {
        const overType = this.getOverType();
        if (overType === "である") {
            // である優先 => 最後の"ですます"を表示
            return `"である"調 と "ですます"調 が混在
=> "${token.value}" がですます調
Total:
である  : ${this.dearuCount}
ですます: ${this.desumasuCount}
`;
        } else if (overType === "ですます") {
            // ですます優先 => 最後の"である"を表示
            return `"である"調 と "ですます"調 が混在
=> "${token.value}" がである調
Total:
である  : ${this.dearuCount}
ですます: ${this.desumasuCount}
`;
        }
    }
}
