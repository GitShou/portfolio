# mocks ディレクトリの使い方

`frontend/mocks/` にはローカル開発や Playwright E2E テストで利用する json-server 用モックデータがまとまっています。本番環境では DynamoDB → API Gateway からデータを取得しますが、ローカルでは同じ `ProjectData.ts` を JSON 化して `/projects` エンドポイントとして提供します。

## 主要ファイル
- `projects.json` – json-server が参照するモック API データ。直接編集せず、後述のスクリプトで再生成してください。
- (必要に応じて追加) – 他のエンドポイントを追加したい場合は JSON ファイルを増やし、json-server の設定で参照させます。

## データ生成フロー
1. 正データは `infrastructure/ap-northeast-1/data/ProjectData.ts` に TypeScript で定義されています。
2. `npm run generate:projects` を実行すると `frontend/scripts/generate-projects-json.ts` が `ProjectData.ts` を読み込み、改行やカード情報を整形して `mocks/projects.json` を生成します。
3. VS Code タスク `npm: mock:api - frontend` や `npm run mock:api` は `generate:projects` を事前実行するため、基本的に手動で `projects.json` を触る必要はありません。

```bash
cd frontend
npm run generate:projects
# => mocks/projects.json が更新される
```

## モック API の起動
```bash
npm run mock:api
# internally runs: npx json-server --watch mocks/projects.json --port 4000
```
`http://localhost:4000/projects` にアクセスすると Next.js から利用する JSON が取得できます。Playwright テスト (`npm run test:e2e`) もこのエンドポイントを前提としています。

## 注意点
- `ProjectData.ts` を変更したら、必ず `npm run generate:projects` を実行して `projects.json` を更新してください。
- `npm run mock:api` は `package.json` の `PROJECTS_API_BASE_URL` を上書きしないため、Next.js 側で `PROJECTS_API_BASE_URL=http://127.0.0.1:4000` を `.env.development.local` に設定しておくと便利です (デフォルトファイルを同梱済み)。
- DynamoDB へ投入するデータは `infrastructure/ap-northeast-1/scripts/seed-projects.ts` から API 経由で登録します。json-server の内容とは別パスなので、本番データを更新する際は両方の経路で再生成/シードしてください。
- `projects.json` を直接編集すると `ProjectData.ts` との整合性が崩れるため、PR レビュー時に差分が出た場合は再生成コマンドの実行漏れを疑ってください。
