import rule from "../src/no-mix-dearu-desumasu"
import TextLintTester from "textlint-tester";
var tester = new TextLintTester();
// ruleName, rule, expected[]
tester.run("no-mix-dearu-desumasu", rule, {
    valid: [
        "昨日はいい天気であったのだが、今日は悪天候である。",
        `今日はいい天気ですね。

そうですね。`,
        // 本文と箇条書きは別のカウント
        `
今日はいい天気ですね。

- 今日はいい天気である。
`,
        // 見出しと箇条書きも別カウント
        `
# 今日はいい天気ですね

- 今日はいい天気である。
`,
        // 見出しと本文も別カウント
        `
# 今日はいい天気ですね

今日はいい天気である。
`


    ],
    invalid: [
        // 本文での混在
        {
            text: `今日はいい天気ですね。
今日はいい天気である。
`,
            errors: [
                // 同数である場合は、"ですます"に統一するのを優先する
                {
                    message: `本文: "である"調 と "ですます"調 が混在
=> "である。" がである調
Total:
である  : 1
ですます: 1
`,
                    line: 2,
                    column: 8
                }
            ]
        },
        // 見出し間での混在
        {
            text: `
# 今日はいい天気ですね

## 今日はいい天気である
`,
            errors: [
                // 同数である場合は、"ですます"に統一するのを優先する
                {
                    message: `見出し: "である"調 と "ですます"調 が混在
=> "である" がである調
Total:
である  : 1
ですます: 1
`,
                    line: 4,
                    column: 11
                }
            ]
        },
// 箇条書き間での混在
        {
            text: `
- 今日はいい天気ですね
- 今日はいい天気である
`,
            errors: [
                // 同数である場合は、"ですます"に統一するのを優先する
                {
                    message: `箇条書き: "である"調 と "ですます"調 が混在
=> "である" がである調
Total:
である  : 1
ですます: 1
`,
                    line: 3,
                    column: 10
                }
            ]
        }
    ]
});