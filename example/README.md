# サンプル

これはサンプルです。

「である」調と「ですます」調の混在を判定するルールとなっている。

結果として「である」調と「ですます」調の使われる数をだしたものである。

```
$ textlint --rule no-mix-dearu-desumasu README.md -f pretty-error

no-mix-dearu-desumasu: "である"調 と "ですます"調 が混在
である  : 1
ですます: 1

textlint-rule-no-mix-dearu-desumasu/example/README.md:7:0
      v
    6. 
    7. 結果として「である」調と「ですます」調の使われる数をだしたものである。
    8. 
```
