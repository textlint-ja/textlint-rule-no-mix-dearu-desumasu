// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";

function countMatchContent(text, reg) {
    let count = 0;
    let matches = text.match(reg) || [];
    count += matches.length;
    return {count, matches};
}
function countMatchContentEnd(text, reg) {
    let count = 0;
    let lines = text.split(/\r\n|\r|\n|\u2028|\u2029/g);
    let matches = [];
    lines.forEach(line => {
        let match = line.match(reg) || [];
        matches = matches.concat(match);
        count += matches.length;
    });
    return {count, matches};
}
export default function noMixDearuDesumasu(context) {
    let {Syntax, RuleError, report, getSource} = context;
    let helper = new RuleHelper(context);
    // This RegExp come from https://github.com/recruit-tech/redpen/blob/master/redpen-core/src/main/java/cc/redpen/validator/sentence/JapaneseStyleValidator.java
    const DEARU_PATTERN = /のだが|ないかと|してきた|であるから/g;
    const DEARU_END_PATTERN = /(?:だ|である|った|ではない｜ないか|しろ|しなさい|いただきたい|いただく|ならない|あろう|られる)(?:[。]?)$/;

    const DESUMASU_PATTERN = /でしたが|でしたので|ですので|ですが/g;
    const DESUMASU_END_PATTERN = /(?:です|ます|ました|ません|ですね|でしょうか|ください|ませ)(?:[。]?)$/;

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
            let matchDearu = countMatchContent(text, DEARU_PATTERN);
            let matchDearuEnd = countMatchContentEnd(text, DEARU_END_PATTERN);
            let matchDesumasu = countMatchContent(text, DESUMASU_PATTERN);
            let matchDesumasuEnd = countMatchContentEnd(text, DESUMASU_END_PATTERN);
            dearuCount += matchDearu.count + matchDearuEnd.count;
            desumasuCount += matchDesumasu.count + matchDesumasuEnd.count;
            if (beforeDearuCount !== dearuCount) {
                dearuLastHit = {
                    node,
                    matches: matchDearu.count > 0 ? matchDearu.matches : matchDearuEnd.matches
                };
            }
            if (beforeDesumasuCount !== desumasuCount) {
                desumasuLastHit = {
                    node,
                    matches: matchDesumasu.count > 0 ? matchDesumasu.matches : matchDesumasuEnd.matches
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