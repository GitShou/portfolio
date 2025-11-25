# Frontend Overview

このフォルダは技術ポートフォリオサイトのフロントエンド (Next.js + TypeScript + Chakra UI) を格納しています。設計・実装・調整を含め、すべて ChatGPT-Codex によって作成されました。

## アーキテクチャと構造
- Next.js (app router) を Static Export 前提で利用し、`fetchProjects` / `fetchProjectById` でビルド時にプロジェクトデータを取得して埋め込み
- UI は Chakra UI コンポーネントで構成し、`HomePageClient` / `ProjectCard` などの小さな粒度に分割
- 型定義は `src/lib/projects/types.ts`、API ヘルパーは `src/lib/projects/api.ts` に集約し、レスポンスをクローン・正規化
- 技術スタックのアイコンは `public/aws-icons` に配置し、`scripts/move-aws-icons.ps1` で参照元からコピー

## ディレクトリ
- `src/components` : UI コンポーネント (Header, Footer, HomePageClient, ProjectCard など)
- `src/lib` : 型定義・API ヘルパー (`projects/types.ts`, `projects/api.ts`)
- `public/` : 静的アセット (AWS アイコンなど)

## 主要スクリプト
- `npm run dev` : 開発サーバー起動
- `npm run lint` : Lint 実行
- `npm run build` : 本番ビルド

## CloudFront ログ
- CloudFront Distribution は `ProjectName-cloudfront-logs` バケットの `cloudfront/` プレフィックスへアクセスログを出力（ライフサイクルで30日保持）
- 同一テンプレートで Glue Database/WorkGroup/テーブルを作成し、Athena から `cloudfront_logs_raw` と Parquet 化済み `cloudfront_logs_parquet` を参照
- EventBridge → Lambda (`CloudFrontAthenaDailyInsertFunction`) が毎日 03:15 UTC に実行され、日付パーティションの追加と Parquet 変換を行い `cloudfront-parquet/` へ配置
- Athena のクエリ結果は `${ProjectName}-athena-results/cloudfront/` に保存されるので、WorkGroup `${ProjectName}-cf-workgroup` を選んで利用

このフロントエンドは ChatGPT-Codex の提案と出力のみで構築されています。
付与された要件やデータ構造に基づき、設計から UI 実装まで一貫して AI 生成で仕上げています。
