import {textlint} from "textlint"
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
    context("混在している時", function () {
        it("should report error", function () {
            var result = textlint.lintMarkdown(`
今日はいい天気ですね。
今日はいい天気である。
`);
            assert(result.messages.length > 0);
            console.log(result);
        });
        it("file", function () {
            var filePath = path.join(__dirname, "/fixtures/pass.md");
            var result = textlint.lintFile(filePath);
            assert(result.filePath === filePath);
            assert(result.messages.length === 0);
        });
    });
});