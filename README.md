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