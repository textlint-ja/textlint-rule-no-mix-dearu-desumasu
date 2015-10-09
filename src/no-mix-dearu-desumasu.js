// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";
import analyze from "./analyze.js";
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
            let {desu,dearu} = analyze(text);
            dearuCount += dearu.count;
            desumasuCount += desu.count;
            if (beforeDearuCount !== dearuCount) {
                dearuLastHit = {
                    node,
                    matches: dearu.matches
                };
            }
            if (beforeDesumasuCount !== desumasuCount) {
                desumasuLastHit = {
                    node,
                    matches: desu.matches
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
である  : ${dearuCount}
ですます: ${desumasuCount}
=> "${desumasuLastHit.matches.join("、")}" がですます調
`);
                report(desumasuLastHit.node, ruleError)
            } else {
                // ですます優先 => 最後の"である"を表示
                let ruleError = new RuleError(`"である"調 と "ですます"調 が混在
である  : ${dearuCount}
ですます: ${desumasuCount}
=> "${dearuLastHit.matches.join("、")}" がである調
`);

                report(dearuLastHit.node, ruleError);
            }
        }
    }
}