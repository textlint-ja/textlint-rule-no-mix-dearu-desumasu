# textlint-rule-no-mix-dearu-desumasu [![Build Status](https://travis-ci.org/azu/textlint-rule-no-mix-dearu-desumasu.svg?branch=master)](https://travis-ci.org/azu/textlint-rule-no-mix-dearu-desumasu)

敬体(ですます調)と常体(である調)

## Installation

    npm install textlint-rule-no-mix-dearu-desumasu

## Usage

Via `.textlintrc`(Recommended)


```json
{
    "rules": {
        "no-mix-dearu-desumasu": true
    }
}
```

Via CLI

```
textlint --rule no-mix-dearu-desumasu README.md
```

## Example

詳しくは[example/](example/)を動かして試してみてください。

```
$ textlint --rule no-mix-dearu-desumasu README.md -f pretty-error

no-mix-dearu-desumasu: 本文: "である"調 と "ですます"調 が混在
=> "である" がである調
Total:
である  : 3
ですます: 3

/Users/azu/.ghq/github.com/azu/textlint-rule-no-mix-dearu-desumasu/example/README.md:7:7
                    v
    6. 
    7. 結果として「である」調と「ですます」調の使われる数をだしたものである。
    8. 
                    ^

✖ 1 problem (1 error, 0 warnings)
```

## FAQ

- Q. 箇条書きの際に「である」調が混在することもあるのでは?
    - 例外) 「です・ます」調の文中の「箇条書き」の部分に「である」調を使う場合
    - http://www.p-press.jp/correct/mailmagazine/mailmagazine24.html
- A. 本文、見出し、箇条書き それぞれは別々にカウントします。

箇条書き(`- リスト`)同士の間で混在している場合はエラーとなりますが、
**本文**と**箇条書き**での混在は問題ありません。

- 本文(Markdownなら通常の文章部分)
- 見出し(Markdownなら`#`)
- 箇条書き(Markdownなら`* item`や`- item`)

それぞれ、別々に扱っているため、これらの間での混在は問題ありません。

## Further Reading

- [JTF日本語標準スタイルガイド](https://www.jtf.jp/jp/style_guide/styleguide_top.html "JTF日本語標準スタイルガイド")
    - 1.1.1 - 1.1.3で同様のルールが扱われています。
    - [azu/textlint-rule-preset-JTF-style: JTF日本語標準スタイルガイド for textlint.](https://github.com/azu/textlint-rule-preset-JTF-style "azu/textlint-rule-preset-JTF-style: JTF日本語標準スタイルガイド for textlint.")も参照してください。

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT

## Acknowledge

Thanks for [RedPen](http://redpen.cc/ "RedPen").