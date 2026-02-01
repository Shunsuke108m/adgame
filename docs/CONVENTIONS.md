# ディレクトリ構成の慣習

- **Pages**: `src/components/pages/` 配下に作成する（例: `GamePage/`, `ProfilePage/`, `RankingPage/`）
- **Atoms（jotai）**: `src/jotai/` 配下にドメインごとに作成する（例: `jotai/Auth/atoms.ts`, `jotai/game/atom.ts`, `jotai/result/atom.ts`）

※ `src/pages/` や `src/atoms/` は使わない
