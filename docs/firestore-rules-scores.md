# スコア（scores）コレクションの Firestore ルール

ランキングとスコア保存を有効にするには、Firestore で `scores` コレクション用のルールを追加してください。

## やること

Firebase Console → Firestore Database → ルール で、既存の `profiles` ルールに続けて **scores** のルールを追加します。

### コピペ用ルール（profiles と scores を両方含む例）

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 公開プロフィール: 誰でも読める（未ログインOK）
    match /profiles/{uid} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }

    // スコア: 全員が読める（ランキング表示用）、書けるのは本人のみ
    match /scores/{uid} {
      allow read: if true;
      allow create, update: if request.auth != null
        && request.auth.uid == uid
        && request.resource.data.bestScore is number
        && request.resource.data.bestScore >= 0
        && request.resource.data.updatedAt == request.time;
      allow delete: if false;
    }
  }
}
```

### 各ルールの意味（scores）

| ルール | 説明 |
|--------|------|
| `allow read: if true` | 誰でもランキング用に `scores/{uid}` を読める |
| `allow create, update` | ログイン本人のみ、かつ `bestScore` が number で 0 以上、`updatedAt` はサーバー時刻 |
| `allow delete: if false` | 削除は禁止（必要なら後で変更可） |

### フィールド制約

- **bestScore**: number かつ 0 以上（必須）
- **updatedAt**: `request.time`（serverTimestamp 想定）
- 上記以外のフィールドはクライアントから書かない想定（必要最小限）

### ルールを変更したあと

1. ルールを「公開」する
2. ゲームをプレイしてログイン状態で 24 週目まで進み、スコアが保存されることを確認する
3. ランキングページで上位が表示されることを確認する
