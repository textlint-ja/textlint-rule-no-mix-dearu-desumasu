// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";

function countMatchContent(text, reg) {
    var count = 0;
    count += (text.match(reg) || []).length;
    return count;
}
function countMatchContentEnd(text, reg) {
    var count = 0;
    var lines = text.split(/\r\n|\r|\n|\u2028|\u2029/g);
    lines.forEach(line => {
        count += (line.match(reg) || []).length;
    });
    return count;
}
export default function noMixDearuDesumasu(context) {
    let {Syntax, RuleError, report, getSource} = context;
    let helper = new RuleHelper(context);
    // This RegExp come from https://github.com/recruit-tech/redpen/blob/master/redpen-core/src/main/java/cc/redpen/validator/sentence/JapaneseStyleValidator.java
    const DEARU_PATTERN = /のだが|したが|したので|ないかと|してきた|であるから/g;
    const DEARU_END_PATTERN = /(?:だ|である|った|ではない｜ないか|しろ|しなさい|いただきたい|いただく|ならない|あろう|られる)(?:[。]?)$/;

    const DESUMASU_PATTERN = /でしたが|でしたので|ですので|ですが/g;
    const DESUMASU_END_PATTERN = /(?:です|ます|ました|ません|ですね|でしょうか|ください|ませ)(?:[。]?)$/;

    let dearuCount = 0;
    let desumasuCount = 0;

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
            var text = getSource(node);
            dearuCount += countMatchContent(text, DEARU_PATTERN);
            dearuCount += countMatchContentEnd(text, DEARU_END_PATTERN);
            desumasuCount += countMatchContent(text, DESUMASU_PATTERN);
            desumasuCount += countMatchContentEnd(text, DESUMASU_END_PATTERN);
        },
        [Syntax.Document + ":exit"](node){
            console.log(dearuCount, desumasuCount);
            if (dearuCount === 0 || desumasuCount === 0) {
                // No problem
                return;
            }
            // である優先
            if (dearuCount > desumasuCount) {
                report(node, new RuleError("である優先。 混在"))
            } else {
                // ですます優先
                report(node, new RuleError("ですます優先。 混在"));
            }
        }
    }

}