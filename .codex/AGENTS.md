# Instructions for AI Agents

## プロジェクト概要
- このリポジトリは、就職活動用の技術ポートフォリオWebサイトです。
- Next.js 15 (App Router) + Chakra UI をフロントエンドに、AWS（API Gateway, Lambda, DynamoDB, S3, CloudFront, WAF）を利用します。
- IaC（Infrastructure as Code）とサーバーレス構成を重視。
- CI/CD は AWS CodePipeline/CodeBuild/CloudFormation (SAM 含む) で構築します。

## ディレクトリ構成と主要ファイル
- `frontend/src/app/`：Next.js アプリのエントリーポイントとページ。`projects/` 配下に詳細ページ。
- `frontend/src/components/`：再利用可能な UI コンポーネント。
- `frontend/src/lib/`：API クライアントや型定義などの共通ロジック。
- `infrastructure/ap-northeast-1/data/ProjectData.ts`：プロジェクトや技術スタック等の仮データ定義（現状のNext.js画面とDynamoDBシーディングで参照）。
- `frontend/public/`：フロントエンドの静的ファイル（画像・アイコン等）。
- `references/`：職務経歴やAWSアイコン等のリファレンス素材。
- `scripts/`：補助スクリプト（例：ログ収集、アイコン移動）。
- `infrastructure/`：AWS 用テンプレート、Lambda、buildspec、シードスクリプト等。
- `infrastructure/ap-northeast-1/templates/route53-template.yml`：Route53 + CloudFront（WAF/Lambda@Edge/ACM は SSM 参照）を定義する Edge スタック。
- `Pipeline/template/`：CodePipeline 定義テンプレート。

## 開発・ビルド・デプロイ
- フロントエンド開発サーバー起動：`cd frontend && npm run dev`
- フロントエンド本番ビルド：`cd frontend && npm run build`
- 静的エクスポート：`cd frontend && npm run export`（必要に応じて）
- E2E（Playwright）：`cd frontend && npm run test:e2e`
- AWS へのデプロイは CodePipeline/CodeBuild を主経路とし、手動デプロイ手順は `README.md` / `infrastructure/README.md` に記載します。

## デプロイ委任時の運用フロー（最新）
- `main` への push をデプロイ起点とする。
- パイプラインは次の順で追跡する。
- 1. us-east-1 の `Portfolio-pipeline`
- 2. ap-northeast-1 の `portfolio`（1の成功後に引き継がれる）
- 監視対象は実行ID、ステージ、失敗理由（CodePipeline / CloudFormationイベント）まで確認する。

### 失敗時の判断基準
- 記述形式や構文など、修正方法が明確で実質1択のエラーは自動修正して再デプロイしてよい。
- 例：CloudFormationのプロパティ名誤り、配列/オブジェクト形式ミス、明白なtypo。
- アーキテクチャや処理フロー全体に関わる判断が必要なエラーは中断し、原因と修正案をレポートする。

### S3再構築エラー時の特例
- デプロイ中に「バケット未空で削除/再作成できない」エラーが出た場合は、次を実施してよい。
- 1. 対象バケットの中身を `s3://backup-5352/<YYYYMMDDTHHMMSSZ>/` のようなタイムスタンプ付きサブディレクトリへ退避
- 2. 対象バケットを空にする
- 3. パイプラインを再実行する

### レポート必須項目
- 失敗したパイプライン名、リージョン、実行ID
- 失敗ステージとAWS側エラーメッセージ
- 影響範囲（frontendのみか、infrastructure/backendを含むか）
- 自動修正した場合は修正内容と再実行結果

## コーディング規約・パターン
- TypeScript + React（関数コンポーネント）を標準とする。
- スタイルはChakraUIまたはCSS Modules（`*.module.css`）。
- Next.js は App Router 前提のため、`getStaticProps` / `getServerSideProps` は利用しない（Server Components / `fetch` 等の標準パターンを優先）。
- フロントエンドの API 連携や署名/クライアント実装は `frontend/src/lib/` 配下に集約する。
- AWS アイコンは原本を `references/aws-icons/` に置き、サイトで利用する分は `frontend/public/aws-icons/` に配置する。
- API Gateway は IAM 認証を利用し、必要に応じて SigV4 署名付きでアクセスする（詳細は `infrastructure/ap-northeast-1/templates/portfolio-backend.yml` とフロント実装を参照）。

## 注意事項・プロジェクト固有の知識
- ドキュメントはすべて日本語で記述。
- チャットでの回答は常に日本語で行う。
- コミットメッセージは日本語で記述する。
- AWSアイコンは`references/aws-icons/`以下のカテゴリ・サイズごとに整理。
- 職務経歴や説明文は`references/職務経歴.txt`を参照。
- スクリプト実行時はPowerShell前提（Windows環境）。
- CI/CDやIaCの詳細はAWS管理画面・CloudFormationテンプレートを参照。
- Next.jsのルーティングは `frontend/src/app/` のディレクトリ構造に依存。
- ChakraUIのコンポーネントは公式ドキュメントを参照。
- リポジトリ直下には `package.json` はなく、フロントエンドは `frontend/package.json` を利用する。
- Node.js（Lambda）は ESM（`type: "module"`）前提。フロントエンドは Next.js/TypeScript の設定に従う。
- ユーザーから複雑な指示があった場合は、実行前に内容を確認すること。
- ユーザーからの指示が不明確な場合は必ず確認を行い、必要なら追加情報を求める。

## フロントエンド・バックエンドのAI実装ルール
- フロントエンド（Next.js/ChakraUI/静的エクスポート/ページ生成等）はAIエージェントが全面的に自動実装・最適化を担当する。
- バックエンド（API Gateway, Lambda, DynamoDB連携やAPI実装、AWSリソース構築等）は、ユーザーから明示的な指示があった場合のみ対応し、原則として自動実装は行わない。必要な場合は必ずユーザーに事前確認を行う。

## 参考ファイル
- `README.md`：全体概要・技術選定・アーキテクチャ方針
- `frontend/src/app/projects/`：プロジェクト詳細ページの実装例
- `frontend/src/components/`：UI パターン
- `infrastructure/ap-northeast-1/data/ProjectData.ts`：データ構造・型定義
- `references/`：参考資料・素材であり、プロジェクト内で利用されるが、直接コード影響しないファイル群

---

AIエージェントは、上記方針・構成・パターンを遵守し、既存実装例を参考にして一貫性のあるコードを生成してください。
