# プロフィールページで読み込みが止まる場合

プロフィールページ（`/profiles/:uid`）が「読み込み中...」のまま進まない場合、**Firestore のセキュリティルール**で `profiles` コレクションの **read** が許可されていない可能性が高いです。

## やること

Firebase Console → Firestore Database → ルール で、次のように **profiles の read を許可**してください。

### 例: 誰でも読める（公開プロフィール用）

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 公開プロフィール: 誰でも読める（未ログインOK）
    match /profiles/{uid} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

- `allow read: if true` … 誰でも `profiles/{uid}` を読める（このページは read-only 想定）
- `allow write` … 本人のみ編集可能（将来のプロフィール編集用）

**OGP 用フィールド**  
`profiles/{uid}` には OGP 生成 API（バックエンド）が **`ogpProfileImageUrl`** と **`ogpProfileGeneratedAt`** を書き込む想定です。これらは Admin SDK 等でサーバー側から書くため、上記の `allow write`（本人のみ）とは別に、バックエンド用の権限で書き込んでください。クライアントはこれらのフィールドを **読むだけ**（既に `allow read: if true` で可）。

### ルールを変更したあと

1. ルールを「公開」する
2. アプリをリロードして `/profiles/（自分のuid）` に再度アクセスする

まだドキュメントが無い uid の場合は「このプロフィールはまだ作成されていません」と表示されます（読み込みで止まりません）。

---

## 画像保存時に「Missing or insufficient permissions」が出る場合

画像アップロード（R2）成功後に **Firestore の `profiles/{uid}` の `photoURL` を更新**しています。この `setDoc` が拒否されると上記エラーになります。

### 確認すること

1. **ログインしているか**  
   `request.auth != null` でないと write は許可されません。編集画面は自分の uid で開いている前提です。
2. **ルールに write があるか**  
   `allow write: if request.auth != null && request.auth.uid == uid;` が `profiles/{uid}` に含まれているか確認してください（上記の例のままなら含まれています）。
3. **ルールを公開したか**  
   ルールを編集したあと「公開」していないと反映されません。

---

## 画像削除・再アップロードで「保存に失敗しました」になる場合

プロフィール編集で「画像を削除」して保存したあと、再度画像をアップロードして保存すると失敗することがあります。

- **画像削除時**: `profiles/{uid}` の `photoURL` に `null` を書き込んでいます。
- **再アップロード時**: 同じく `setDoc` の `merge: true` で `photoURL` を文字列で更新しています。

どちらも同じ書き方（`setDoc` merge）にしているので、**Firestore ルールで `photoURL` を string 限定にしないでください**。  
`allow write: if request.auth != null && request.auth.uid == uid;` のように「本人のみ書ける」だけにしておけば、`photoURL` に `null` を書くことも、あとから文字列を書くことも許可されます。  
`request.resource.data.photoURL is string` のような型チェックを入れていると、画像削除（null）や再アップロードの書き込みが拒否されることがあります。
