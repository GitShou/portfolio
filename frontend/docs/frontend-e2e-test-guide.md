# フロントエンド E2E テスト実行マニュアル

本ドキュメントは、Next.js フロントエンドのエンドツーエンド (E2E) テストをローカルおよび CI 環境で実行するための手順をまとめたものです。

## 前提条件

- Node.js 18 系 (CodeBuild と揃える)
- 依存パッケージをインストール済みであること
  ```bash
  npm install
  ```
- Playwright のブラウザバイナリを取得済みであること
  ```bash
  npx playwright install
  ```
- `.env.development.local` が存在し、モック API を指していること
  ```bash
  PROJECTS_API_BASE_URL=http://127.0.0.1:4000
  ```

## モック API の起動 (任意)

Playwright テストは `playwright.config.ts` の `webServer` 設定によりモック API (`npm run mock:api`) と Next.js (`npm run dev`) を自動起動します。そのため、テスト実行前に手動で起動する必要はありません。

画面を目視確認したい場合は、別ターミナルで以下を実行しておきます。

```bash
npm run mock:api
npm run dev
```

## E2E テストの実行

### 1. ヘッドレス実行

```bash
npm run test:e2e
```

- `tests/e2e/` 配下のテストが Chromium で実行されます。
- テスト中に自動でモック API と Next.js 開発サーバーが起動・停止します。
- 失敗時には `test-results/` 以下にスクリーンショット・ログが保存されます。

### 2. UI モードでの実行

```bash
npm run test:e2e:ui
```

- Playwright の UI を起動し、テストケースごとにブラウザ操作を確認できます。

### 3. スナップショット更新

```bash
npm run test:e2e:update
```

- スナップショットを利用するテストが増えた場合に、期待値を更新するコマンドです。

## CI (AWS CodeBuild) での実行

- `buildspec/buildspec-nextjs.yml` の `build` フェーズで `CI=1 npm run test:e2e` を実行します。
- `CI=1` の指定により、Playwright は CI モードで動作し、リトライや失敗時の動画・スクリーンショット保存が有効化されます。
- テスト成果物は CodeBuild のセカンダリアーティファクト `NextJsPlaywrightResults` として出力されます。

## 成果物の確認

- ローカル実行時: `test-results/` ディレクトリを直接確認してください。
- CI 実行時: CodeBuild のアーティファクトから `NextJsPlaywrightResults` をダウンロードし、テストログやスクリーンショットを参照できます。

## トラブルシューティング

- **ポート競合が発生する場合**: 既に `npm run mock:api` や `npm run dev` を手動で起動していると Playwright の自動起動と競合します。手動で起動しているプロセスを停止してください。
- **ブラウザがダウンロードされない場合**: `npx playwright install` を再実行してブラウザバイナリを取得してください。
- **API 接続エラーが出る場合**: `.env.development.local` の `PROJECTS_API_BASE_URL` が正しく設定されているか、モックサーバーが応答しているかを確認してください。

以上でフロントエンド E2E テストの実行手順は完了です。必要に応じてテストケースを追加し、UI のレグレッションを自動的に検知できるようメンテナンスを継続してください。
