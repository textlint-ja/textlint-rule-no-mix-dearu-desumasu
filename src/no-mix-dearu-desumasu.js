// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";
import BodyMixedChecker from "./BodyMixedChecker";
import HeaderMixedChecker from "./HeaderMixedChecker";
export default function noMixedDearuDesumasu(context) {
    const {Syntax, getSource} = context;
    const helper = new RuleHelper(context);
    const strChecker = new BodyMixedChecker(context);
    const headerChecker = new HeaderMixedChecker(context);
    return {
        [Syntax.Header](node){
            const text = getSource(node);
            headerChecker.check(node, text);
        },
        [Syntax.Str](node){
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }
            // 例外) 「です・ます」調の文中の「箇条書き」の部分に「である」調を使う場合
            // http://www.p-press.jp/correct/mailmagazine/mailmagazine24.html
            if (helper.isChildNode(node, [Syntax.Header, Syntax.ListItem])) {
                return;
            }
            const text = getSource(node);
            strChecker.check(node, text);
        },
        [Syntax.Document + ":exit"](){
            return strChecker.checkout().then(() => {
                return headerChecker.checkout();
            });
        }
    }
}