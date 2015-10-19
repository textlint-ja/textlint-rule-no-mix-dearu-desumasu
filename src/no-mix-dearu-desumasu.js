// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";
import {analyzeDesumasu,analyzeDearu} from "analyze-desumasu-dearu";
export default function noMixDearuDesumasu(context) {
    let {Syntax, RuleError, report, getSource} = context;
    let helper = new RuleHelper(context);
    let dearuCount;
    let desumasuCount;

    let dearuLastHit;
    let desumasuLastHit;

    function initialize() {
        dearuCount = 0;
        desumasuCount = 0;

        dearuLastHit = null;
        desumasuLastHit = null;
    }

    return {
        [Syntax.Document]: initialize,
        [Syntax.Str](node){
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }
            // 例外) 「です・ます」調の文中の「箇条書き」の部分に「である」調を使う場合
            // http://www.p-press.jp/correct/mailmagazine/mailmagazine24.html
            if (helper.isChildNode(node, [Syntax.ListItem])) {
                return;
            }
            let beforeDearuCount = dearuCount;
            let beforeDesumasuCount = desumasuCount;
            let text = getSource(node);
            let retDearu = analyzeDearu(text, {analyzeConjunction: false});
            let retDesumasu = analyzeDesumasu(text, {analyzeConjunction: false});
            dearuCount += retDearu.length;
            desumasuCount += retDesumasu.length;
            if (beforeDearuCount !== dearuCount) {
                dearuLastHit = {
                    node,
                    matches: retDearu
                };
            }
            if (beforeDesumasuCount !== desumasuCount) {
                desumasuLastHit = {
                    node,
                    matches: retDesumasu
                };
            }
        },
        [Syntax.Document + ":exit"](node){
            if (dearuCount === 0 || desumasuCount === 0) {
                // No problem
                return;
            }
            if (dearuCount > desumasuCount) {
                // である優先 => 最後の"ですます"を表示
                let hitNode = desumasuLastHit.matches[0];
                let ruleError = new RuleError(`"である"調 と "ですます"調 が混在
=> "${hitNode.value}" がですます調
Total:
である  : ${dearuCount}
ですます: ${desumasuCount}
`, {
                    line: hitNode.lineNumber - 1,
                    column: hitNode.columnIndex
                });
                report(desumasuLastHit.node, ruleError)
            } else if (dearuLastHit.matches) {
                // ですます優先 => 最後の"である"を表示
                let hitNode = dearuLastHit.matches[0];
                let ruleError = new RuleError(`"である"調 と "ですます"調 が混在
=> "${hitNode.value}" がである調
Total:
である  : ${dearuCount}
ですます: ${desumasuCount}
`, {
                    line: hitNode.lineNumber - 1,
                    column: hitNode.columnIndex
                });

                report(dearuLastHit.node, ruleError);
            }
        }
    }
}