# Portfolio Web System

本システムは、AWS を主軸にしたクラウドネイティブ開発のスキルと実績を第三者が理解しやすい形で提示するための技術ポートフォリオです。Next.js を用いたフロントエンドと、サーバーレスな AWS バックエンドを IaC と CI/CD で一貫管理しています。

## 主な特徴
- **クラウド完結型ポートフォリオ**: Web 公開からデータ永続化、配信、監視までを AWS 上で閉じることで、実運用を想定した構成を再現。
- **IaC と自動化の徹底**: CloudFormation/SAM でインフラをコード化し、CodePipeline を中心にビルド・テスト・デプロイを自動化。
- **サーバーレスアーキテクチャ**: API Gateway + Lambda + DynamoDB を採用し、静的サイト生成と API を組み合わせたモダンな構成を体験可能。
- **実案件ベースのコンテンツ**: DynamoDB に格納したプロジェクト情報から静的ページを生成し、スキルセットや成果を一貫したフォーマットで紹介。
- **AI 活用の開示**: 開発体制における AI エージェント活用の実例を公開し、新しい開発プロセスの知見を共有。

## アーキテクチャ概要
- **リポジトリ管理**: GitHub 上でソースコードとインフラテンプレートを一元管理。
- **フロントエンド**: Next.js (App Router) + Chakra UI。静的エクスポートを基本とし、CloudFront/S3 で配信。
- **バックエンド**: API Gateway、Lambda、DynamoDB を中心に構成。Lambda@Edge による URL 書き換えや SSM Parameter Store 連携も実装。
- **CI/CD**: CodePipeline / CodeBuild / CodeDeploy / CloudFormation。コードの push からデプロイまでをノンストップで実行。
- **監視・セキュリティ**: CloudFront + WAF、IAM 認証付き API、SSM Parameter Store によるシークレット管理を実装。

## 技術スタック
- **フロントエンド**: TypeScript, Next.js, Chakra UI, Playwright (E2E テスト)
- **バックエンド**: AWS Lambda, Amazon API Gateway, Amazon DynamoDB, Lambda@Edge
- **IaC / 自動化**: AWS SAM, CloudFormation, CodePipeline, CodeBuild, CodeDeploy
- **データ管理**: DynamoDB (プロジェクト情報), SSM Parameter Store (設定値), json-server (ローカルモック)

## 開発フロー
1. 開発者はフロントエンド/インフラのコードを GitHub に push。
2. CodePipeline が起動し、lint, test, build を CodeBuild 上で実施。
3. フロントエンドは静的出力を生成し S3/CloudFront へ、バックエンドは SAM で Lambda などをデプロイ。
4. DynamoDB の初期データは `ProjectData.ts` を基に Lambda (API) 経由でシードされ、フロントエンドは API から静的ビルド時に取得。

## 再現手順 (概略)
1. ローカル開発: `npm install` `npm run dev` で Next.js 開発サーバーを起動。json-server モック API は VS Code タスク経由で自動生成。
2. インフラ: `infrastructure/` 配下の SAM テンプレートを `sam deploy` などで展開。必要なパラメータは SSM に自動登録。
3. デプロイ後、`scripts/seed-projects.ts` を実行すると DynamoDB に最新のプロジェクトデータがアップロードされる。

## 想定読者
- クラウドネイティブ開発や AWS サーバーレス構成に関心のある採用担当者・技術責任者
- IaC/CI/CD を組み込んだモダンなポートフォリオサイトを参考にしたいエンジニア
- AI エージェントを伴う開発プロセスに興味があるエンジニアリングチーム

## 今後の展望
- 認証付き管理画面の追加によるプロジェクトデータ編集の自動化
- 監視運用 (CloudWatch Canary 等) の導入とアラート設計
- テストケース拡充による継続的品質保証
- パイプライン構成のさらなる IaC 化と複数環境への展開支援

本リポジトリは、少人数でも高品質な成果を出すためのクラウドネイティブ開発・自動化・ドキュメンテーションの実践例として活用いただけます。