# textlint-rule-no-mix-dearu-desumasu [![Build Status](https://travis-ci.org/azu/textlint-rule-no-mix-dearu-desumasu.svg?branch=master)](https://travis-ci.org/azu/textlint-rule-no-mix-dearu-desumasu)

「ですます」調と「である」調の混在をチェックする[textlint](https://github.com/azu/textlint "textlint")ルール。

## Installation

    npm install textlint-rule-no-mix-dearu-desumasu

## Usage

    npm install textlint textlint-rule-no-mix-dearu-desumasu
    textlint --rule no-mix-dearu-desumasu

## Example

More detail in [example/](example/).

```
$ textlint --rule no-mix-dearu-desumasu README.md -f pretty-error

no-mix-dearu-desumasu: "である"調 と "ですます"調 が混在
である  : 1
ですます: 1

/Users/azu/.ghq/github.com/azu/textlint-rule-no-mix-dearu-desumasu/example/README.md:7:0
      v
    6. 
    7. 結果として「である」調と「ですます」調の使われる数をだしたものである。
    8. 
```

## FAQ

- Q. 箇条書きの際に「である」調が混在することもあるのでは?
    - 例外) 「です・ます」調の文中の「箇条書き」の部分に「である」調を使う場合
    - http://www.p-press.jp/correct/mailmagazine/mailmagazine24.html
- A. 箇条書き(Markdownの`-`や`*`)は判定から除外されているので、箇条書きに関しては混在出来ます。

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