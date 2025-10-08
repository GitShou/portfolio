# portfolio

技術関係の自己紹介ページのプロジェクト

## 概要

就職活動用のポートフォリオWebサイト。技術関係に関する経歴や実績を記載するサイトです。

### 技術テーマ

- **AWS を使った IaC（Infrastructure as Code）**
- **サーバーレスアーキテクチャ**

## アーキテクチャ

### 使用技術

#### フロントエンド
- **Next.js** - React フレームワーク（Static Export モード）
- **TypeScript** - 型安全な開発
- **Chakra UI** - UI コンポーネントライブラリ
- **React Icons** - アイコンライブラリ

#### AWS サービス
- **Amazon S3** - 静的ファイルのホスティング
- **Amazon CloudFront** - CDN による高速コンテンツ配信
- **AWS WAF** - Web アプリケーションファイアウォール
- **AWS CodePipeline** - CI/CD パイプライン
- **AWS CodeBuild** - ビルドの自動化
- **AWS CloudFormation** - インフラストラクチャのコード化

### デプロイフロー

```
GitHub Push
    ↓
CodePipeline (自動起動)
    ↓
CodeBuild (ビルド実行)
    ↓
S3 (HTMLファイル配置)
    ↓
CloudFront (配信)
    ↓
WAF (保護)
```

## セットアップ

### 前提条件

- Node.js 20.x 以上
- npm または yarn
- AWS アカウント
- GitHub アカウント

### ローカル開発

1. リポジトリをクローン

```bash
git clone https://github.com/GitShou/portfolio.git
cd portfolio
```

2. 依存関係をインストール

```bash
npm install
```

3. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

4. ビルド

```bash
npm run build
```

ビルドされたファイルは `out/` ディレクトリに出力されます。

## AWS インフラストラクチャのデプロイ

### 1. GitHub Personal Access Token の作成

1. GitHub の Settings > Developer settings > Personal access tokens > Tokens (classic) に移動
2. "Generate new token (classic)" をクリック
3. 必要なスコープを選択：
   - `repo` (Full control of private repositories)
   - `admin:repo_hook` (Full control of repository hooks)
4. トークンを生成して安全に保管

### 2. CloudFormation スタックのデプロイ

AWS CLI を使用してデプロイします：

```bash
aws cloudformation create-stack \
  --stack-name portfolio-infrastructure \
  --template-body file://cloudformation/infrastructure.yaml \
  --parameters \
    ParameterKey=GitHubRepo,ParameterValue=GitShou/portfolio \
    ParameterKey=GitHubBranch,ParameterValue=main \
    ParameterKey=GitHubToken,ParameterValue=YOUR_GITHUB_TOKEN \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

**注意:** WAF と CloudFront は us-east-1 リージョンで作成する必要があります。

### 3. デプロイの確認

```bash
aws cloudformation describe-stacks \
  --stack-name portfolio-infrastructure \
  --query 'Stacks[0].Outputs'
```

CloudFront の URL が出力されます。

### 4. 自動デプロイ

main ブランチに push すると、自動的に以下が実行されます：

1. GitHub Webhook が CodePipeline をトリガー
2. CodePipeline が CodeBuild を起動
3. CodeBuild が Next.js アプリをビルド
4. ビルド成果物を S3 にアップロード
5. CloudFront のキャッシュを無効化

## プロジェクト構造

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx             # ホームページ
│   │   └── providers.tsx        # Chakra UI プロバイダー
│   └── components/              # 再利用可能なコンポーネント
├── public/                      # 静的ファイル
├── cloudformation/
│   └── infrastructure.yaml      # AWS インフラ定義
├── buildspec.yml                # CodeBuild ビルド仕様
├── next.config.js               # Next.js 設定
├── tsconfig.json                # TypeScript 設定
└── package.json                 # 依存関係
```

## カスタマイズ

### コンテンツの編集

- メインページ: `src/app/page.tsx`
- スタイル: `src/app/providers.tsx` (Chakra UI テーマ)

### インフラの変更

CloudFormation テンプレートを編集：
- `cloudformation/infrastructure.yaml`

変更を反映：

```bash
aws cloudformation update-stack \
  --stack-name portfolio-infrastructure \
  --template-body file://cloudformation/infrastructure.yaml \
  --parameters \
    ParameterKey=GitHubRepo,ParameterValue=GitShou/portfolio \
    ParameterKey=GitHubBranch,ParameterValue=main \
    ParameterKey=GitHubToken,ParameterValue=YOUR_GITHUB_TOKEN \
  --capabilities CAPABILITY_IAM
```

## セキュリティ

- **WAF ルール**
  - レート制限: 2000 リクエスト/5分
  - AWS マネージド共通ルールセット
  - 既知の不正入力ルールセット

- **S3 セキュリティ**
  - パブリックアクセスブロック有効
  - CloudFront OAC による制限付きアクセス
  - バージョニング有効

- **CloudFront**
  - HTTPS 強制リダイレクト
  - 圧縮有効

## コスト最適化

- CloudFront Price Class: PriceClass_100 (北米・欧州のみ)
- S3 アーティファクト: 30日後に自動削除
- CodeBuild: BUILD_GENERAL1_SMALL (最小インスタンス)

## トラブルシューティング

### ビルドが失敗する場合

```bash
# CodeBuild ログを確認
aws codebuild batch-get-builds --ids <build-id>
```

### CloudFront キャッシュをクリア

```bash
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

## ライセンス

ISC

## 作者

GitShou
