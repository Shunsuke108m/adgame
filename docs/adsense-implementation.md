# Google AdSense 実装ガイド

このドキュメントは、本アプリでの AdSense 広告枠の実装方法と、400 Bad Request などのトラブル時の確認ポイントをまとめたものです。

## 実装の構成

- **index.html**: `<head>` 内で `adsbygoogle.js` を 1 回だけ読み込む（`async` + `client=ca-pub-xxx`）。
- **AdSenseSlot** (`src/components/common/AdSenseSlot.tsx`): `<ins>` と `(adsbygoogle = window.adsbygoogle || []).push({})` を React 上で扱う共通コンポーネント。

### 実装のポイント

1. **スクリプトは 1 回だけ**: `index.html` で読み込み、コンポーネント内では読み込まない。
2. **push のタイミング**: `useEffect` 内で `requestAnimationFrame` により 1 フレーム遅延してから `push({})` し、`<ins>` が DOM に反映された後に実行する。
3. **固定サイズ（正方形）**: `data-ad-format` や `data-ad-width` / `data-ad-height` は使わず、**CSS の width/height のみ**で 250x250 を指定。Google の「CSS でサイズを指定するレスポンシブ広告」のパターンに合わせる。
4. **レスポンシブ**: `data-ad-format="auto"` と `data-full-width-responsive="true"` を使用。

## 400 Bad Request が出る場合の確認

1. **AdSense 側の広告ユニット**
   - 広告ユニットを新規作成した直後は、反映まで時間がかかることがある（目安: 1 時間程度）。しばらく待ってから再度表示を確認する。
   - 固定サイズで使う場合: AdSense で「表示広告」の「固定サイズ」で 250x250 などを作成しているか、または「レスポンシブ」で作成し、サイト側では CSS で 250x250 にしているかを確認する。

2. **コードの一致**
   - `data-ad-client` が AdSense の「発行者 ID」（ca-pub-xxxxx）と一致しているか。
   - `data-ad-slot` が各広告ユニットの「広告ユニット ID」と一致しているか。
   - index.html の script の `client=` と、`<ins>` の `data-ad-client` が同じか。

3. **ブラウザ**
   - キャッシュを空にして再読み込みする。
   - 開発者ツールの Network で `pagead2.googlesyndication.com` や `googleads.g.doubleclick.net` へのリクエストの URL とステータスを確認する。

4. **React の挙動**
   - 開発時は StrictMode により 2 回マウントされ、`push` が 2 回走ることがある。本番では 1 回になる。400 の原因が StrictMode だけとは限らないが、本番ビルドでも 400 が出るか確認する。

## 配置箇所

- **ランキングページ**: リスト・「上位100位を表示」ボタンの下に 250x250 の正方形枠（`square`）。
- **結果モーダル**: 「もう一度プレイ」「ランキングを見る」の下に 250x250 の正方形枠（`square`）。

## 参考

- [How to modify your responsive ad code - AdSense Help](https://support.google.com/adsense/answer/9183363)（CSS でサイズ指定する例）
- [Guidelines for fixed-sized display ad units - AdSense Help](https://support.google.com/adsense/answer/9185043)
- [Common issues with ad code implementation - AdSense Help](https://support.google.com/adsense/answer/9189018)
