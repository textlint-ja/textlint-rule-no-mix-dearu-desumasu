// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";
import {analyze, isDearu, isDesumasu} from "analyze-desumasu-dearu";
export class MixedChecker {
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
            if (this.dearuCount === 0 || this.desumasuCount === 0) {
                // No problem
                return;
            }
            const RuleError = this.context.RuleError;
            const report = this.context.report;
            if (this.dearuCount > this.desumasuCount) {
                // である優先 => 最後の"ですます"を表示
                const hitNode = this.desumasuLastHit.matches[0];
                const ruleError = new RuleError(`"である"調 と "ですます"調 が混在
=> "${hitNode.value}" がですます調
Total:
である  : ${this.dearuCount}
ですます: ${this.desumasuCount}
`, {
                    index: hitNode.index
                });
                report(this.desumasuLastHit.node, ruleError)
            } else if (this.dearuLastHit.matches) {
                // ですます優先 => 最後の"である"を表示
                const hitNode = this.dearuLastHit.matches[0];
                const ruleError = new RuleError(`"である"調 と "ですます"調 が混在
=> "${hitNode.value}" がである調
Total:
である  : ${this.dearuCount}
ですます: ${this.desumasuCount}
`, {
                    index: hitNode.index
                });

                report(this.dearuLastHit.node, ruleError);
            }
        });
    }
}
export default function noMixedDearuDesumasu(context) {
    const {Syntax, getSource} = context;
    const helper = new RuleHelper(context);
    const strChecker = new MixedChecker(context);
    return {
        [Syntax.Str](node){
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }
            // 例外) 「です・ます」調の文中の「箇条書き」の部分に「である」調を使う場合
            // http://www.p-press.jp/correct/mailmagazine/mailmagazine24.html
            if (helper.isChildNode(node, [Syntax.ListItem])) {
                return;
            }
            const text = getSource(node);
            strChecker.check(node, text);
        },
        [Syntax.Document + ":exit"](){
            return strChecker.checkout();
        }
    }
}