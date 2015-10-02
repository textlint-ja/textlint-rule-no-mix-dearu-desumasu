import {textlint} from "textlint"
import createFormatter from "textlint-formatter"
import rule from "../src/no-mix-dearu-desumasu"
import path from "path"
import assert from "power-assert"
describe("no-mix-dearu-desumasu", function () {
    beforeEach(function () {
        textlint.setupRules({
            "no-mix-dearu-desumasu": rule
        });
    });
    afterEach(function () {
        textlint.resetRules();
    });
    context("混在ケース", function () {
        it("接続が混在してるとreportされる", function () {
            var result = textlint.lintMarkdown(`
昨日は雨だったのだが、持ち直した。
昨日は雨だったのですが、持ち直しました。
`);
            assert(result.messages.length === 1);
        });
        it("文末が混在してるとreportされる", function () {
            var result = textlint.lintMarkdown(`
今日はいい天気ですね。
今日はいい天気である。
`);
            assert(result.messages.length === 1);
        });
        it("箇条書きでの混在は無視される", function () {
            var result = textlint.lintMarkdown(`
- 今日はいい天気ですね。
- 今日はいい天気である。
`);
            assert(result.messages.length === 0);
        });
    });
    context("混在していない場合", function () {
        it("should not report error", function () {
            var result = textlint.lintMarkdown(`
昨日はいい天気であったのだが、今日は悪天候である。
`);
            assert.equal(result.messages.length, 0);
        });
        it("should not report error", function () {
            var result = textlint.lintMarkdown(`
今日はいい天気ですね。

そうですね。
`);
            assert.equal(result.messages.length, 0);
        });
    });
});