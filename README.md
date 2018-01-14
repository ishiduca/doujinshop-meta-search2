# doujinshop-meta-search2

## features

- **meta search**: 同人ショップの簡易検索を横断して行います
- **manage your favorite**  検索結果で気になるアイテムをローカルサイドで記録、管理します

## meta search

### shops

下記の同人誌販売ショップの簡易検索結果を取得します

- とらのあな[`www.toranoana.jp`](http://www.toranoana.jp/)
- メロンブックス[`www.melonbooks.co.jp`](https://www.melonbooks.co.jp/)
- COMIC ZIN[`www.comiczin.jp`](http://www.comiczin.jp/)
- 同人堂[`web.doujindou.com/`](http://web.doujindou.com/)
- Alice Books[`alice-books.com/`](http://alice-books.com/)

### search command

先頭に __:__ を付けると **検索コマンド** の入力が可能です

```
:(category) (keyword)
```

#### category

- __:mak__ 発行サークル
- __:act__ 筆者
- __:nam__ 作品名
- __:mch__ メインキャラクタ名
- __:gnr__ ジャンル名
- __:com__ コメント
- __:kyw__ キーワード、タグ

ex "宮水三葉" のキャラクタ名で検索

```
:mch 宮水三葉
```

- 一部の検索サービスではカテゴリーが反映されないのでフリーワード検索の結果を返します


### manage your favorite

各検索結果のアイテムの下方のアイコンのクリックで保存/破棄を行います。
