# Copilot Instructions for AI Agents

## プロジェクト概要
- このリポジトリは、就職活動用の技術ポートフォリオWebサイトです。
- Next.js + ChakraUI をフロントエンドに、AWS（Lambda, API Gateway, DynamoDB, CloudFront, WAF）をバックエンドに利用。
- IaC（Infrastructure as Code）とサーバーレス構成を重視。
- CI/CDはAWS CodePipeline/CodeBuild/CodeDeploy/CloudFormationで構築。

## ディレクトリ構成と主要ファイル
- `src/app/`：Next.jsアプリのエントリーポイントとページ。`projects/`配下にプロジェクト詳細ページ。
- `components/`：再利用可能なReactコンポーネント（例：`ProjectCard.tsx`, `Header.tsx`）。
- `infrastructure/ap-northeast-1/data/ProjectData.ts`：プロジェクトや技術スタック等の仮データ定義（現状のNext.js画面とDynamoDBシーディングで参照）。
- `public/`：静的ファイル（画像等）。
- `references/`：職務経歴やAWSアイコン等のリファレンス素材。
- `scripts/`：運用用スクリプト（例：`move-aws-icons.ps1`）。
- `infrastructure/`：テンプレートなどのAWS用のソースコードを格納する。

## 開発・ビルド・デプロイ
- 開発サーバー起動：`npm run dev`
- 本番ビルド：`npm run build`
- 静的エクスポート：`npm run export`（必要に応じて）
- AWSへのデプロイはCI/CDパイプライン経由（手動デプロイは推奨しない）
- 開発はテンプレート駆動型で行う

## コーディング規約・パターン
- TypeScript + React（関数コンポーネント）を標準とする。
- スタイルはChakraUIまたはCSS Modules（`*.module.css`）。
- データ取得や状態管理はNext.jsの標準機能（`getStaticProps`/`getServerSideProps`等）を優先。
- AWSリソース連携はAPI経由で行い、直接SDKを使う場合は`lib/`配下にまとめる。
- 画像やアイコンは`public/`または`references/aws-icons/`配下に配置。
- APIGatewayはVPC内にデプロイし、WANから直接アクセスできないようにする。

## 注意事項・プロジェクト固有の知識
- AWSアイコンは`references/aws-icons/`以下のカテゴリ・サイズごとに整理。
- 職務経歴や説明文は`references/職務経歴.txt`を参照。
- スクリプト実行時はPowerShell前提（Windows環境）。
- CI/CDやIaCの詳細はAWS管理画面・CloudFormationテンプレートを参照。
- Next.jsのルーティングは`app/`ディレクトリ構造に依存。
- ChakraUIのコンポーネントは公式ドキュメントを参照。
- ドキュメントはすべて日本語で記述。
- チャットでの回答は常に日本語で行う。
- プロジェクトのルートディレクトリに存在するpackage.jsonはnext.js用である。
- javascriptやtypescriptのコードを書くときはESMモジュール形式を使う。

## フロントエンド・バックエンドのAI実装ルール
- フロントエンド（Next.js/ChakraUI/静的エクスポート/ページ生成等）はAIエージェントが全面的に自動実装・最適化を担当する。
- バックエンド（API Gateway, Lambda, DynamoDB連携やAPI実装、AWSリソース構築等）は、ユーザーから明示的な指示があった場合のみ対応し、原則として自動実装は行わない。必要な場合は必ずユーザーに事前確認を行う。

## 参考ファイル
- `README.md`：全体概要・技術選定・アーキテクチャ方針
- `src/app/projects/`：プロジェクト詳細ページの実装例
- `components/ProjectCard.tsx`：プロジェクトカードのUIパターン
- `infrastructure/ap-northeast-1/data/ProjectData.ts`：データ構造・型定義
- `references/`：参考資料・素材であり、プロジェクト内で利用されるが、直接コード影響しないファイル群

---

AIエージェントは、上記方針・構成・パターンを遵守し、既存実装例を参考にして一貫性のあるコードを生成してください。