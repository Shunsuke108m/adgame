# アプリ構成・処理フロー（プロンプト用）

このドキュメントは、どこでどんな処理をしているかを整理したものです。プロンプトやオンボーディングに利用してください。

---

## 1. 技術スタック・構成

- **フロント**: React + TypeScript, Vite
- **ルーティング**: react-router-dom (BrowserRouter)
- **状態**: Jotai (ゲーム状態・認証・モーダル), TanStack Query (サーバー状態)
- **バックエンド**: Firebase Auth, Firestore / Cloudflare Worker + R2（画像アップロード）

### ディレクトリ概要

```
src/
  App.tsx                    # ルート定義、QueryClientProvider、AuthObserver、RequireProfileRedirect
  main.tsx
  lib/                       # Firebase 初期化、gameConfig、gameRow 導出ロジック
  jotai/                     # グローバル状態（Auth, Game, GameResult, DescriptionModal）
  providers/                 # AuthObserver（onAuthStateChanged → jotai）
  components/
    features/                # 機能単位（AuthUser, Profile, Score, ActionButtons, ResultModal 等）
    pages/                   # ページ（GamePage, RankingPage, ProfilePage, ProfileEditPage）
  types/
  styles/
```

---

## 2. ルーティング

| パス | ページ | 備考 |
|------|--------|------|
| `/` | GamePage | ゲーム本体 |
| `/ranking` | RankingPage | ランキング（初期20→100件表示） |
| `/profiles/:uid` | ProfilePage | 公開プロフィール |
| `/profiles/:uid/edit` | ProfileEditPage | プロフィール編集（自分のみ） |

- **AppLayout**: Header + `<Outlet />`。`<Outlet />` は `RequireProfileRedirect` でラップされている。
- **RequireProfileRedirect**: ログイン済みかつプロフィール未作成なら `/profiles/{auth.uid}` へリダイレクト。既にプロフィール/編集ページにいる場合は何もしない。

---

## 3. 認証（Auth）

### 3.1 どこで何をしているか

| 場所 | 処理 |
|------|------|
| **providers/AuthObserver.tsx** | `onAuthStateChanged(auth, ...)` を購読。`user` を `authUserAtom`、`authReadyAtom`、`gameResultModalAuthUserAtom` に反映。 |
| **jotai/Auth/atoms.ts** | `authUserAtom`, `authReadyAtom` の定義。 |
| **features/AuthUser/authActions.ts** | `loginWithGoogle()`（signInWithPopup）, `logout()`（signOut）を提供。 |
| **features/AuthUser/hooks/useAuthUser.ts** | `authUserAtom` / `authReadyAtom` を参照し、`user`, `authReady`, `isMine(uid)` を返す。 |

- 認証状態は **Jotai** で保持。Firebase Auth の変更は AuthObserver 経由で Jotai に流れる。
- ヘッダーのログイン/ログアウト・プロフィールリンクは `useAuthUser()` と `authActions` を使用。

---

## 4. ゲーム（Game）

### 4.1 ゲーム状態（Jotai）

| 場所 | 内容 |
|------|------|
| **jotai/Game/atom.ts** | `gamePlayStateAtom`: `{ rows: GameRow[], activeActions: string[], bestScore }`。初期値は `INITIAL_ROW`（1週目）と `buildGameRow(1, COST, CPM, CTR, CVR)`。`INITIAL_GAME_PLAY_STATE` は「もう一度プレイ」用。 |
| **lib/gameRow.ts** | COST/CPM/CTR/CVR から IMP/CV/CPA を導出。`buildGameRow(weekNum, cost, cpm, ctr, cvr)` で GameRow を組み立て。 |
| **types/GameRow.ts** | `GameRow` 型（week, cost, cpm, imp, ctr, cvr, cv, cpa の表示用文字列）。 |

### 4.2 1ターン分のロジック

| 場所 | 処理 |
|------|------|
| **features/ActionButtons/hooks.ts** | `computeNextState(prev)`: 現在行から cost/cpm/ctr/cvr をパース → 選択中アクション（CPNBtn, CRBtn, LPBtn, increaseBtn）に応じて数値を更新 → `buildGameRow(weekNum, ...)` で次の行を生成 → `rows` の先頭に追加、`bestScore` 更新。 |
| **features/ActionButtons/index.tsx** | アクションボタン UI。`useGameExecute()` で「実行」、`useGameToggle()` で選択トグル。 |
| **features/GameTable/** | `gamePlayStateAtom` の `rows` を表示。トレンド表示用の `trend.ts` あり。 |

### 4.3 ゲーム終了・スコア送信

| 場所 | 処理 |
|------|------|
| **features/ActionButtons/hooks.ts** | `useGameExecute()`: 実行時に `computeNextState`。次の行が「24週目」なら `openGameResultModal({ score, bestScore })` と `submitScore(cv)` を実行。`submitScore` 成功後に `queryClient.invalidateQueries({ queryKey: ["topScores"] })` でランキングを無効化。 |
| **features/Score/api/scoresApi.ts** | `submitScore(score)`: 未ログインなら return。`scores/{uid}` を getDoc → bestScore が無い or score > bestScore のときだけ setDoc(merge)。続けて `updateBestScore(uid, score)` で `profiles/{uid}.bestScore` を同期。 |
| **features/ResultModal/** | 結果モーダル。スコア・ベストスコア表示、ログイン時はプロフィール共有コピー・編集リンク。「もう一度プレイ」で `gamePlayStateAtom` を `INITIAL_GAME_PLAY_STATE` に戻す。 |

---

## 5. プロフィール（Profile）

### 5.1 Firestore: profiles/{uid}

- **読み取り**: `getProfile(uid)`（profileApi.ts）。誰でも可（ルールで read: true）。
- **書き込み**: 本人のみ（ルールで `request.auth.uid == uid`）。  
  - `upsertProfile(uid, { nickname, bio?, snsUrl? })`: 作成/更新。  
  - `updatePhotoURL(uid, photoURL)`: 画像アップロード後に photoURL のみ更新。  
  - `updateBestScore(uid, bestScore)`: スコア保存時に scores と同期（scoresApi から呼ばれる）。

### 5.2 プロフィール表示（/profiles/:uid）

| 場所 | 処理 |
|------|------|
| **pages/ProfilePage** | `useParams().uid` を ProfilePageView に渡す。 |
| **features/Profile/components/ProfilePageView/index.tsx** | オーケストレーション。`useProfile(uid)`, `useAuthUser()`, `useProfileSavedToast()`, `useTopScores(100)` を使用。読み込み/エラー/未作成(自分/他人)/存在で子コンポーネントを切り替え。 |
| **ProfilePageView** | 順位表示は `useTopScores(100)` の結果から uid を検索し、`rankDisplay`: "NN位" or "100位圏外" を算出。ProfileCard に渡す。 |
| **ProfileCard** | 名刺風カード。nickname, bio, snsUrl, photoURL, bestScore, rankDisplay。自分のときだけ右下に「編集」オーバーレイ。 |
| **ProfileIncompleteCard** | 自分のプロフィールが未作成のときの誘導。中央に「表示名を入力」ボタン。`useGoToProfileEdit(uid)` の `goToEdit` で編集ページへ。 |
| **ProfileEmptyCard** | 他人のプロフィールが未作成のとき。 |
| **ProfileActionBar** | 「このカードを共有」＋コピー結果トースト、自分のときだけログアウトリンク。`useProfilePageShare()` で URL コピー。 |
| **useProfileSavedToast** | location.state.profileSaved を参照し、「保存しました」トースト表示と state クリア。 |

### 5.3 プロフィール編集（/profiles/:uid/edit）

| 場所 | 処理 |
|------|------|
| **pages/ProfileEditPage** | `useParams().uid` を ProfileEditView に渡す。 |
| **ProfileEditView** | `useAuthUser()`, `useProfile(uid)`, `useProfileForm`, `useProfileEditAvatar`。未ログイン or 他人の uid ならログイン案内 or Navigate to `/profiles/:uid`。フォーム送信時: 画像選択済みなら `avatar.uploadImage.mutateAsync` → 続けて `form.handleSubmit`。 |
| **useProfileForm** | nickname/bio/snsUrl のローカル状態、バリデーション、同一判定。変更があれば `useUpsertProfile(uid).mutate({ nickname, bio, snsUrl })`。空で保存する場合も API で上書きするため bio/snsUrl は常に文字列で渡す。 |
| **useUpsertProfile** | `upsertProfile(uid, payload)` を mutation で実行。onSuccess で `invalidateQueries(["profile", uid])` と `navigate(/profiles/:uid, { state: { profileSaved: true } })`。 |
| **useProfileEditAvatar** | ファイル選択、プレビュー、`useUploadProfileImage()` でアップロード。 |
| **useUploadProfileImage** | **常に現在ログイン中の uid（useAuthUser().user?.uid）を使用**。`convertAvatar` → `getProfileImageUploadUrl(authUid, contentType)` → `putProfileImage(uploadUrl, blob, contentType)` → `updatePhotoURL(authUid, publicUrl)`。onSuccess で `invalidateQueries(["profile", authUid])` のみ（ランキングは invalidate しない）。 |

### 5.4 プロフィール画像アップロード（外部 API）

| 場所 | 処理 |
|------|------|
| **features/Profile/api/profileImageApi.ts** | `VITE_IMAGE_API_BASE` に POST `/profile-images/upload-url`（body: key, contentType。ヘッダ `x-upload-token`: `VITE_UPLOAD_TOKEN`）→ uploadUrl / publicUrl 取得。続けて PUT uploadUrl に Blob を送信。 |
| **features/Profile/image/convertAvatar.ts** | 画像を 256x256 の正方形に変換（webp/jpeg）。 |
| **Worker 側** | upload-url で署名付き URL 相当を返し、PUT で R2 に保存。トークンは `x-upload-token` で検証。 |

---

## 6. ランキング（Score / Ranking）

### 6.1 Firestore: scores/{uid}

- **書き込み**: `submitScore(score)` のみ（ゲーム終了時、ログイン本人）。bestScore が更新される場合のみ setDoc + profiles の bestScore 同期。
- **読み取り**: `getRankingRaw(limit)` で `orderBy("bestScore", "desc"), limit(limit)`。rank は配列 index + 1。

### 6.2 ランキング取得・表示

| 場所 | 処理 |
|------|------|
| **features/Score/api/scoresApi.ts** | `getRankingRaw(limitCount)`: scores を bestScore 降順で limit 件取得。`getRankingWithProfiles(limitCount)`: 上記に加え各 uid の `getProfile(uid)` で nickname/photoURL/bioPreview を結合。rank は index + 1。`toBioPreview(bio)`: 最大 140 文字まで返し、省略は UI の CSS に任せる。 |
| **features/Score/hooks/useTopScores.ts** | `useTopScores(limitCount)`。queryKey: `["topScores", limitCount]`。staleTime 5分、refetchOnWindowFocus: false、**refetchOnMount: "always"**（ランキング表示のたびに再取得し、全員の最新画像を反映）。 |
| **pages/RankingPage** | `useState(20)` で初期 limit。`useTopScores(limit)`。一覧は順位・アバター・ニックネーム・自己紹介（あれば）・ベストスコア。行タップで `/profiles/:uid` へ。下部に「上位100位を表示」ボタンで limit=100 に変更。 |
| **スコア更新直後の順位** | ActionButtons の `useGameExecute` 内で `submitScore(cv)` の then に `queryClient.invalidateQueries({ queryKey: ["topScores"] })` を実行。次のランキング表示時に再取得される。 |

---

## 7. TanStack Query のキャッシュ

| queryKey | 使用箇所 | 無効化タイミング |
|----------|----------|------------------|
| `["profile", uid]` | useProfile, useUpsertProfile, useUploadProfileImage の onSuccess | プロフィール保存後、画像アップロード後 |
| `["topScores", limit]` | useTopScores(20), useTopScores(100) | ゲーム終了後の submitScore 成功時（invalidate）。表示時は refetchOnMount: "always" で毎回再取得。 |

---

## 8. 環境変数（.env.local 等）

| 変数 | 用途 |
|------|------|
| `VITE_FIREBASE_*` | Firebase 初期化（lib/firebase.ts） |
| `VITE_IMAGE_API_BASE` | 画像アップロード API のベース URL（例: https://api.xxx.com） |
| `VITE_UPLOAD_TOKEN` | 画像 API 用トークン。ヘッダ `x-upload-token` で送る。Worker の UPLOAD_TOKEN と一致させる。 |

---

## 9. 主要ファイル一覧（責務）

| ファイル | 責務 |
|----------|------|
| **App.tsx** | ルート、QueryClient、AuthObserver、RequireProfileRedirect の配置。 |
| **providers/AuthObserver.tsx** | onAuthStateChanged → jotai（authUser, authReady, gameResultModalAuthUser）。 |
| **jotai/Game/atom.ts** | ゲーム初期行（4指標から buildGameRow）、gamePlayStateAtom、INITIAL_GAME_PLAY_STATE。 |
| **lib/gameRow.ts** | COST/CPM/CTR/CVR から IMP/CV/CPA を導出。buildGameRow。 |
| **features/ActionButtons/hooks.ts** | computeNextState、useGameExecute（24週目で結果モーダル＋submitScore＋topScores invalidate）、useOpenGameResultModal。 |
| **features/Score/api/scoresApi.ts** | submitScore、getRankingRaw、getRankingWithProfiles、toBioPreview。 |
| **features/Score/hooks/useTopScores.ts** | ランキング取得。refetchOnMount: "always"。 |
| **features/Profile/api/profileApi.ts** | getProfile、upsertProfile、updatePhotoURL、updateBestScore。 |
| **features/Profile/api/profileImageApi.ts** | getProfileImageUploadUrl、putProfileImage（Worker + R2）。 |
| **features/Profile/hooks/useUploadProfileImage.ts** | 画像アップロード（auth.uid で統一）。onSuccess で profile のみ invalidate。 |
| **features/Profile/RequireProfileRedirect.tsx** | ログイン済みかつプロフィール未作成なら /profiles/:uid へリダイレクト。 |
| **features/Profile/components/ProfilePageView/index.tsx** | プロフィールページの状態分岐と子コンポーネント出し分け。useTopScores(100) で rankDisplay 算出。 |

---

## 10. Firestore ルール（要約）

- **profiles/{uid}**: read: true。write: `request.auth != null && request.auth.uid == uid`。
- **scores/{uid}**: read: true。create/update: 本人のみ。bestScore は number かつ 0 以上。updatedAt は serverTimestamp 想定。

詳細は `docs/firestore-rules-profile.md` と `docs/firestore-rules-scores.md` を参照。
