// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";
import {analyzeDesumasu,analyzeDearu} from "analyze-desumasu-dearu";
export default function noMixDearuDesumasu(context) {
    let {Syntax, RuleError, report, getSource} = context;
    let helper = new RuleHelper(context);
    let dearuCount = 0;
    let desumasuCount = 0;

    let dearuLastHit = null;
    let desumasuLastHit = null;

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
            let beforeDearuCount = dearuCount;
            let beforeDesumasuCount = desumasuCount;
            let text = getSource(node);
            let retDearu = analyzeDearu(text);
            let retDesumasu = analyzeDesumasu(text);
            dearuCount += retDearu.count;
            desumasuCount += retDesumasu.count;
            if (beforeDearuCount !== dearuCount) {
                dearuLastHit = {
                    node,
                    matches: retDearu.matches
                };
            }
            if (beforeDesumasuCount !== desumasuCount) {
                desumasuLastHit = {
                    node,
                    matches: retDesumasu.matches
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
                let ruleError = new RuleError(`"である"調 と "ですます"調 が混在
=> "${desumasuLastHit.matches.map(match => match.value).join("、")}" がですます調
Total:
である  : ${dearuCount}
ですます: ${desumasuCount}
`);
                report(desumasuLastHit.node, ruleError)
            } else {
                // ですます優先 => 最後の"である"を表示
                let ruleError = new RuleError(`"である"調 と "ですます"調 が混在
=> "${dearuLastHit.matches.map(match => match.value).join("、")}" がである調
Total:
である  : ${dearuCount}
ですます: ${desumasuCount}
`);

                report(dearuLastHit.node, ruleError);
            }
        }
    }
}