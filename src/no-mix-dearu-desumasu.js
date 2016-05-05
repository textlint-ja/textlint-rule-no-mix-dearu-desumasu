// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";
import BodyMixedChecker from "./BodyMixedChecker";
import HeaderMixedChecker from "./HeaderMixedChecker";
import ListMixedChecker from "./ListMixedChecker";
module.exports = function noMixedDearuDesumasu(context) {
    const {Syntax, getSource} = context;
    const helper = new RuleHelper(context);
    const strChecker = new BodyMixedChecker(context);
    const headerChecker = new HeaderMixedChecker(context);
    const listChecker = new ListMixedChecker(context);
    return {
        // 見出し
        [Syntax.Header](node){
            const text = getSource(node);
            headerChecker.check(node, text);
        },
        // 箇条書き
        [Syntax.ListItem](node){
            const text = getSource(node);
            listChecker.check(node, text);
        },
        // 本文
        [Syntax.Str](node){
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }
            // 見出しと箇条書きは別途チェックするので Header > Str などは無視する
            if (helper.isChildNode(node, [Syntax.Header, Syntax.ListItem])) {
                return;
            }
            const text = getSource(node);
            strChecker.check(node, text);
        },
        [Syntax.Document + ":exit"](){
            return Promise.all([
                strChecker.checkout(),
                headerChecker.checkout(),
                listChecker.checkout()
            ]);
        }
    }
};