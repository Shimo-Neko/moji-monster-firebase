# 開発フローと CI/CD

このリポジトリは、Firebase の **開発用プロジェクト** と **本番用プロジェクト** を分け、
GitHub Actions で自動デプロイする構成です。

## ブランチ運用

| ブランチ | 役割 |
| --- | --- |
| `feature/*` | 作業用。ここで開発し、PR を出す |
| `develop` | 開発環境に自動デプロイされる |
| `main` | 本番環境にデプロイされる（承認ゲート付き） |

流れ: `feature/*` →（PR）→ `develop` →（PR）→ `main`

- `develop` / `main` へは直接 push せず、PR 経由で変更します（運用ルール）。
- PR を出すと `CI` ワークフローが走り、`npm ci` + `npm run build`（型チェック含む）が通らないとマージしない運用です。

> ブランチ保護について: ルールセット `protect-main-develop` が有効化されています（対象: `main` / `develop`）。内容は「PR 経由でない変更の禁止（承認 0 件で可）」「ブランチ削除の禁止」「force push の禁止」で、CI の `build` チェックが一度でも実行された後は「ステータスチェック `build` 必須」も追加されます。設定変更は Settings > Rules > Rulesets から。なお GitHub Free プランでは非公開リポジトリに保護を設定できないため、このリポジトリが public であることが前提です。

## 環境の切り替え

- `.firebaserc` のエイリアスでプロジェクトを切り替えます。**実際のプロジェクト ID に書き換えてください**（現在は `moji-monster-dev` / `moji-monster-prod` という仮 ID です）。
- 設定値は Vite のモード別 `.env` で分けます。
  - 開発: `.env.development`（雛形: `.env.development.example`）
  - 本番: `.env.production`（雛形: `.env.production.example`）
  - ローカル用 `.env` も従来通り使えます（未設定ならローカルモード）。
- npm スクリプト:
  - `npm run build:dev` / `npm run build:prod`
  - `npm run deploy:dev` / `npm run deploy:prod`（対応モードでビルドしてから、Hosting + Firestore ルールをデプロイ。`firebase deploy` 単体ではビルドされないので、必ずこちらを使う）
- Firebase プロジェクト側の準備（プロジェクトごとに必要）: Authentication（匿名・Google）を有効化、Firestore を作成。

## GitHub Secrets（Settings > Secrets and variables > Actions）

| 名前 | 内容 |
| --- | --- |
| `ENV_DEVELOPMENT` | `.env.development` の中身そのもの（開発用プロジェクトの設定値一式） |
| `ENV_PRODUCTION` | `.env.production` の中身そのもの（本番用プロジェクトの設定値一式） |
| `FIREBASE_SERVICE_ACCOUNT_DEV` | 開発用プロジェクトのサービスアカウントキー（JSON 全文） |
| `FIREBASE_SERVICE_ACCOUNT_PROD` | 本番用プロジェクトのサービスアカウントキー（JSON 全文） |

サービスアカウントは Firebase コンソール > プロジェクトの設定 > サービスアカウント から発行できます。権限は「Firebase Hosting 管理者」と「Firebase ルール管理者」（または編集者）を付けてください。

## 本番デプロイの承認ゲート

1. Settings > Environments > **New environment** で `production` を作る
2. **Required reviewers** に自分を追加する
3. `main` へマージされると Deploy (prod) ワークフローが承認待ちで止まり、承認するとデプロイされます

開発用も同様に `development` 環境を作っておくと、Secrets を環境ごとに分けて管理できます（承認は不要）。

## ワークフロー一覧

- `CI`（`.github/workflows/ci.yml`）: PR 時にビルド確認
- `Deploy (dev)`（`deploy-dev.yml`）: `develop` への push で開発環境へ自動デプロイ
- `Deploy (prod)`（`deploy-prod.yml`）: `main` への push で本番へデプロイ（`production` 環境の承認が必要）
