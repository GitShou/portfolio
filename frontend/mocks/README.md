# mocks ディレクトリの使い方

このフォルダにはフロントエンドのローカル開発や E2E テストで使用するモックデータを配置します。現状は `json-server` を利用し、`projects.json` から `/projects` エンドポイントを提供しています。

## ファイル構成

- `projects.json`: `json-server` が参照するモック API データ。Next.js 側の `ProjectCard` や詳細ページで利用するプロジェクト一覧を保持します。
- (任意追加) 将来的にエンドポイントを増やす場合は、REST 風の JSON をこのフォルダに追加してください。

## データ生成

元データは `infrastructure/ap-northeast-1/data/ProjectData.ts` に TypeScript で定義されています。下記スクリプトを実行すると、その内容から `mocks/projects.json` を再生成します。

```bash
npm run generate:projects
```

このコマンドは `frontend/scripts/generate-projects-json.ts` を実行し、`ProjectData.ts` の内容を整形して JSON を出力します。`json-server` を起動する VS Code タスク (`npm: mock:api - frontend`) ではこの生成ステップが依存関係として登録されているため、通常は手動実行しなくても最新状態が維持されます。

## モック API の起動

VS Code のタスクパネルから `npm: mock:api - frontend` を実行するか、ターミナルで以下を実行します。

```bash
npm run generate:projects
npx json-server --watch mocks/projects.json --port 4000
```

`http://localhost:4000/projects` にアクセスするとプロジェクト一覧を取得できます。

## 注意事項

- `ProjectData.ts` を変更したら、必ず `npm run generate:projects` を実行して JSON を更新してください。
- `json-server` を利用しない場合でも、このフォルダ内の JSON は E2E テストの期待値確認に利用されるため、手動編集時は整合性に注意してください。
- DynamoDB の本番データを更新するシード処理（`infrastructure/ap-northeast-1/scripts/seed-projects.ts`）とは別経路なので、必要に応じて両方を更新してください。
