# Portfolio Web System

クラウドネイティブ開発の実績をエンドツーエンドで示すための技術ポートフォリオです。Next.js 15 (App Router) + Chakra UI による静的サイトを AWS (API Gateway / Lambda / DynamoDB / S3 / CloudFront / WAF) 上でホストし、CloudFormation/SAM と CodePipeline で IaC・CI/CD を完結させています。

## システム構成のハイライト
- **静的フロントエンド**: `frontend/` の Next.js は `npm run build && npm run export` で `out/` を生成し、`scripts/prepare-static-paths.ts` で `/projects/123/` のディレクトリ配信に対応した上で S3 + CloudFront へ配置します。
- **サーバレスバックエンド**: `infrastructure/ap-northeast-1/templates/portfolio-backend.yml` が API Gateway + Lambda (Node.js 22) + DynamoDB を定義し、SSM Parameter Store に API Base URL を登録するカスタムリソースも同梱しています。
- **データ駆動のコンテンツ**: `infrastructure/ap-northeast-1/data/ProjectData.ts` が唯一の正データ。ローカルは json-server、AWS では DynamoDB 経由で同じデータを配信します。
- **多段リージョン構成**: us-east-1 に WAF/Lambda@Edge (`infrastructure/us-east-1/templates/CloudFrontWafWebAcl.yml`) を配置し、ap-northeast-1 のフロントエンド・スタックから SSM 経由で参照します。
- **完全自動パイプライン**: `Pipeline/template/portfolio-codepipeline-*.yml` で CodePipeline/CodeBuild を IaC 化。バックエンドの打鍵、フロントビルド、Playwright E2E、静的ファイル配信、DynamoDB Seed までをコードで再現できます。

## フォルダ構成
- `frontend/` – Next.js 15 + Chakra UI。`tests/e2e` (Playwright) や `buildspec/` も格納。
- `infrastructure/` – SAM/CloudFormation テンプレート、Lambda ソース、CodeBuild buildspec、シードスクリプト、設計資料 (draw.io)。
- `Pipeline/` – CodePipeline テンプレート (ap-northeast-1 用 / us-east-1 用)。
- `references/` – 公開用レジュメなどポートフォリオに付随する資料。
- `scripts/` – CloudWatch Logs 収集などの補助 PowerShell/Node スクリプト。

## ローカル開発フロー
1. `cd frontend`
2. `npm install`
3. `npm run mock:api` で json-server (`http://127.0.0.1:4000/projects`) を起動  
   VS Code タスク `npm: mock:api - frontend` でも同じ処理が走り、起動前に `npm run generate:projects` が呼ばれます。
4. 別ターミナルで `npm run dev` (Next.js dev server)。`PROJECTS_API_BASE_URL` を別 API に向けたい場合は `.env.development.local` で上書きしてください。
5. Playwright スモークテスト: `npm run test:e2e` – mock API/Next.js Dev サーバーが起動している状態で実行します。

> Next.js 15 を利用しているため、ローカルの Node.js は v18 以上を推奨します。

## インフラ適用と CI/CD
- **us-east-1 (事前構築)**  
  `infrastructure/us-east-1/templates/CloudFrontWafWebAcl.yml` を SAM/CloudFormation でデプロイ → WebACL ARN と Lambda@Edge Version ARN を SSM (例: `/portfolio/waf/arn`, `/portfolio/ViewerRequestRewriteFunctionVersion/arn`) に格納します。`buildspec/packaging-template.yml` + `buildspec-put-waf-arn.yml` を CodeBuild から呼び出すことで同作業を自動化できます。
- **ap-northeast-1**  
  - `templates/portfolio-backend.yml`: DynamoDB (`${ProjectName}-projects-v1`)、API Gateway、5 種の Lambda、SSM Parameter Writer カスタムリソースなどを定義。
  - `templates/portfolio-frontend.yml`: 静的サイト S3、CloudFront、OAI、Route53 レコードを作成し、us-east-1 で登録済みの WebACL / Lambda@Edge ARN を SSM 経由で参照。
- **CodePipeline**  
  `Pipeline/template/portfolio-codepipeline-JP.yml` (ap-northeast-1) と `...US.yml` で Source → Build(CloudFormation) → Build(Next.js / Playwright) → Deploy(S3/CloudFront) → Seed(DynamoDB) の 3 ステージ構成を IaC 化しています。各ステージで使う buildspec は `infrastructure/ap-northeast-1/buildspec/` と `frontend/buildspec/` に配置。

### BuildSpec の役割 (抜粋)
- `infrastructure/ap-northeast-1/buildspec-cfn.yml`  
  Lambda 単体テスト → `aws cloudformation package` → フロント/Seed ファイルをアーティファクト化。
- `buildspec-pre-cfn.yml`  
  失敗スタックのクリーンアップ (ROLLBACK/FAILED) を自動化して再デプロイ性を確保。
- `buildspec-seed-projects.yml`  
  `PROJECTS_API_BASE_URL` を SSM から取得し、TypeScript でコンパイルした `scripts/seed-projects.ts` を実行。
- `frontend/buildspec-nextjs.yml`  
  `.env.production` を CodeBuild 上で生成 → Playwright スモークテスト → `npm run build` → `npm run postbuild`。
- `frontend/buildspec-deploy-contents.yml`  
  `out/` を S3 Sync、ディレクトリアクセス用の `index.html` エイリアス作成、CloudFront Invalidation を実施。

## データとシード
1. プロジェクト情報は `infrastructure/ap-northeast-1/data/ProjectData.ts` で TypeScript として定義。
2. `frontend/scripts/generate-projects-json.ts` が `ProjectData.ts` を正規化して `mocks/projects.json` を生成。
3. 本番/ステージングでは `infrastructure/ap-northeast-1/scripts/seed-projects.ts` を使い、API (IAM 署名) 経由で DynamoDB を upsert。

手動シード手順:
```powershell
cd infrastructure/ap-northeast-1/scripts
npm ci
$env:PROJECTS_API_BASE_URL="https://xxxx.execute-api.ap-northeast-1.amazonaws.com/prod"
npx tsc --project ./tsconfig.seed.json
node dist/scripts/seed-projects.js
```
SigV4 署名が必要なため、AWS CLI と同じ認証情報が使える環境で実行してください。

## テスト
- `npm run lint` – Next.js プロジェクト内で ESLint を実行。
- `npm run test:e2e` – Playwright。json-server + Next.js Dev サーバー起動後に実行。
- Lambda は `infrastructure/ap-northeast-1/Lambda` で `npm install && npm test`。CodePipeline でも `buildspec-cfn.yml` 内で同ユニットテストを回します。

## 参考資料
- `infrastructure/docs/アーキテクチャ図.drawio` – 全体構成図。
- `infrastructure/docs/dynamodb-projects-table.md` – DynamoDB テーブルと GSI 設計。
- `references/` – ポートフォリオで参照しているレジュメ・自己紹介資料。

これらの README / テンプレートは、デプロイに必要な SSM パス・Route53 Hosted Zone・ACM ARN などを明示しています。新しい環境を作る際は各値を適宜変更してください。
