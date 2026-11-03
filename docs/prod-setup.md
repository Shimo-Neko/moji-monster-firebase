# 本番環境（prod）セットアップ手順書

開発環境（dev）で構築した CI/CD を本番環境にも適用するための手順です。dev で実際に踏んだエラーと対処も含めてあります。本番プロジェクトの作成から初回デプロイまで、この順番で進めてください。

前提：開発環境は構築済み（https://moji-monster-dev.web.app/ へ自動デプロイ成功済み）。リポジトリには `Deploy (prod)` ワークフローと `.firebaserc` の `prod` エイリアス（仮ID `moji-monster-prod`）が入っています。

## 1. Firebase 本番プロジェクトを作成

1. [Firebase コンソール](https://console.firebase.google.com/) で「プロジェクトを追加」から新規プロジェクトを作成する（dev とは別プロジェクトにする）。
2. プロジェクト ID を控える（この後の手順で何度も使う。例：`moji-monster-prod` のような任意のIDでよいが、既に使われている名前は取れない）。
3. プロジェクトトップで「Webアプリ（</>）」を追加し、表示される設定値（apiKey / authDomain / projectId / storageBucket / messagingSenderId / appId）を控える。

## 2. Authentication と Firestore を有効化

1. 「構築 > Authentication > 始める」→「Sign-in method」で **匿名** を有効化する（必須：ゲーム開始時に自動で匿名サインインする）。
2. 同じ画面で **Google** も有効化する（任意：プレイヤーのアカウント連携用）。
3. 「構築 > Firestore Database > データベースの作成」で「本番環境モード」で作成する（ルールはデプロイ時にリポジトリの `firestore.rules` が適用される）。

> 本番のデータは開発環境とは完全に別です。公開モンスタープールも空の状態から始まります。

## 3. `.firebaserc` の prod を実IDに差し替える

リポジトリの `.firebaserc` を開き、`prod` の値を手順1のプロジェクト ID に変更して、PR 経由で `develop` にマージする。

```json
{ "projects": { "dev": "moji-monster-dev", "prod": "<本番プロジェクトID>" } }
```

## 4. デプロイ用サービスアカウントキーを発行

1. Firebase コンソールで**本番プロジェクト**を開き、「プロジェクトの設定 > サービスアカウント」→「新しい秘密鍵の生成」で JSON をダウンロードする。
2. JSON はパスワード同然の機密情報です。チャットやリポジトリに貼らず、手順7で GitHub Secrets に直接登録する。

## 5. サービスアカウントに IAM ロールを付与（重要）

[Google Cloud コンソール](https://console.cloud.google.com/) で本番プロジェクトを開き、「IAM と管理 > IAM」で、手順4のサービスアカウント（`firebase-adminsdk-...@<本番プロジェクトID>.iam.gserviceaccount.com`）に次の **3つのロール** を追加する。

| ロール | ロールID | 用途 |
| --- | --- | --- |
| Firebase Hosting 管理者 | `roles/firebasehosting.admin` | Hosting へのデプロイ |
| Firebase ルール管理者 | `roles/firebaserules.admin` | Firestore ルールのデプロイ |
| Service Usage 管理者 | `roles/serviceusage.serviceUsageAdmin` | デプロイ前のAPI有効状態の確認・有効化 |

- 最初から付いている「Firebase Admin SDK 管理者サービス エージェント」「Firebase Authentication 管理者」「サービス アカウント トークン作成者」ではデプロイできません（名前に「管理者」とあっても用途が別です）。dev で実際に 403 エラーになったことを確認済みです。
- ロールの追加は、そのプリンシパルの行の鉛筆アイコン →「別のロールを追加」から行います。

## 6. ローカル用 `.env.production` を作る

```bash
cp .env.production.example .env.production
```

手順1で控えた本番の設定値を記入する。**実ファイルはコミットしません**（`.gitignore` 済み）。ローカルから本番へ手動デプロイしたい場合は `npm run deploy:prod`（ビルド込み）を使います。

## 7. GitHub Secrets を登録

リポジトリの **Settings > Secrets and variables > Actions**（Dependabot のタブではない）で、Repository secrets に次の2つを登録する。名前は一字一句この通りに。

| 名前 | 値 |
| --- | --- |
| `ENV_PRODUCTION` | 手順6の `.env.production` の**中身全文** |
| `FIREBASE_SERVICE_ACCOUNT_PROD` | 手順4のサービスアカウントキー **JSON 全文** |

## 8. GitHub Environment `production` を作成（承認ゲート）

1. リポジトリの **Settings > Environments > New environment** で、名前 `production` の環境を作成する。
2. **Required reviewers** に自分を追加する。
3. これにより、`main` へのマージで `Deploy (prod)` が走っても、承認するまでデプロイが実行されなくなります。

## 9. 初回デプロイテスト

1. `develop` → `main` の PR を作る（CI の `build` チェックが成功すること）。
2. PR をマージすると `Deploy (prod)` ワークフローが起動し、**承認待ち**で止まる。
3. Actions のラン画面で「Review deployments」→ `production` にチェック →「Approve and deploy」。
4. 全ステップが成功したら、本番URL `https://<本番プロジェクトID>.web.app/` を開いて表示を確認する。

## トラブルシューティング（dev で実際に起きたもの）

| 症状 | 原因と対処 |
| --- | --- |
| 認証ステップで `must specify exactly one of "workload_identity_provider" or "credentials_json"` | サービスアカウントの Secret がジョブから見えていない。未登録・名前の打ち間違い・Dependabot タブへの登録が典型例。手順7を確認 |
| デプロイステップで `serviceusage.googleapis.com ... 403 Permission denied to get service` | Service Usage の権限不足。手順5の `roles/serviceusage.serviceUsageAdmin` を追加 |
| Hosting／ルールの公開で 403 | 手順5の Firebase Hosting 管理者／Firebase ルール管理者の不足 |
| ローカルの `firebase deploy` で `Directory 'dist' for Hosting does not exist.` | ビルドしていない。`firebase deploy` 単体ではなく `npm run deploy:prod` を使う |

## チェックリスト

- [ ] 本番 Firebase プロジェクト作成＋Webアプリ追加（設定値を控えた）
- [ ] Authentication（匿名／Google）と Firestore を有効化
- [ ] `.firebaserc` の prod を実IDに差し替え（PRマージ済み）
- [ ] サービスアカウントキー発行
- [ ] IAM ロール3点（Hosting 管理者／ルール管理者／Service Usage 管理者）を付与
- [ ] `.env.production` 作成（ローカル・未コミット）
- [ ] Secrets 登録（`ENV_PRODUCTION` / `FIREBASE_SERVICE_ACCOUNT_PROD`）
- [ ] Environment `production` 作成＋Required reviewers 設定
- [ ] develop → main の PR マージ → 承認 → 本番URLで表示確認
