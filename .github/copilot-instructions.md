# Copilot Instructions for AI Agents

## プロジェクト概要
- このリポジトリは、就職活動用の技術ポートフォリオWebサイトです。
- Next.js + ChakraUI をフロントエンドに、AWS（Lambda, API Gateway, DynamoDB, CloudFront, WAF）をバックエンドに利用。
- IaC（Infrastructure as Code）とサーバーレス構成を重視。
- CI/CDはAWS CodePipeline/CodeBuild/CodeDeploy/CloudFormationで構築。

## ディレクトリ構成と主要ファイル
- `src/app/`：Next.jsアプリのエントリーポイントとページ。`projects/`配下にプロジェクト詳細ページ。
- `components/`：再利用可能なReactコンポーネント（例：`ProjectCard.tsx`, `Header.tsx`）。
- `lib/data.ts`：プロジェクトや技術スタック等のデータ定義。
- `public/`：静的ファイル（画像等）。
- `references/`：職務経歴やAWSアイコン等のリファレンス素材。
- `scripts/`：運用用スクリプト（例：`move-aws-icons.ps1`）。

## 開発・ビルド・デプロイ
- 開発サーバー起動：`npm run dev`
- 本番ビルド：`npm run build`
- 静的エクスポート：`npm run export`（必要に応じて）
- AWSへのデプロイはCI/CDパイプライン経由（手動デプロイは推奨しない）

## コーディング規約・パターン
- TypeScript + React（関数コンポーネント）を標準とする。
- スタイルはChakraUIまたはCSS Modules（`*.module.css`）。
- データ取得や状態管理はNext.jsの標準機能（`getStaticProps`/`getServerSideProps`等）を優先。
- AWSリソース連携はAPI経由で行い、直接SDKを使う場合は`lib/`配下にまとめる。
- 画像やアイコンは`public/`または`references/aws-icons/`配下に配置。

## 注意事項・プロジェクト固有の知識
- AWSアイコンは`references/aws-icons/`以下のカテゴリ・サイズごとに整理。
- 職務経歴や説明文は`references/職務経歴.txt`を参照。
- スクリプト実行時はPowerShell前提（Windows環境）。
- CI/CDやIaCの詳細はAWS管理画面・CloudFormationテンプレートを参照。

## 参考ファイル
- `README.md`：全体概要・技術選定・アーキテクチャ方針
- `src/app/projects/`：プロジェクト詳細ページの実装例
- `components/ProjectCard.tsx`：プロジェクトカードのUIパターン
- `lib/data.ts`：データ構造・型定義

---

AIエージェントは、上記方針・構成・パターンを遵守し、既存実装例を参考にして一貫性のあるコードを生成してください。