# 開発ガイド

このドキュメントでは、ポートフォリオサイトの開発に関する情報を提供します。

## 開発環境のセットアップ

### 必要なツール

- Node.js 20.x 以上
- npm 10.x 以上
- Git
- コードエディタ（VS Code推奨）

### 初期セットアップ

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

ブラウザで http://localhost:3000 を開いてサイトを確認できます。

## プロジェクト構造

```
portfolio/
├── src/                          # ソースコード
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # ルートレイアウト
│   │   ├── page.tsx              # トップページ
│   │   └── providers.tsx         # Chakra UIプロバイダー
│   └── components/               # 共有コンポーネント（今後追加）
├── public/                       # 静的アセット
├── cloudformation/               # AWS インフラ定義
│   └── infrastructure.yaml       # CloudFormationテンプレート
├── buildspec.yml                 # CodeBuildビルド定義
├── next.config.js                # Next.js設定
├── tsconfig.json                 # TypeScript設定
├── package.json                  # 依存関係
├── README.md                     # プロジェクト概要
└── DEPLOYMENT.md                 # デプロイメントガイド
```

## 開発ワークフロー

### ブランチ戦略

- `main` - 本番環境にデプロイされるブランチ
- `feature/*` - 新機能開発用ブランチ
- `fix/*` - バグ修正用ブランチ

### コミット

変更をコミットする前に：

```bash
# ビルドが通ることを確認
npm run build

# 必要に応じてリント（今後追加予定）
# npm run lint
```

### プルリクエスト

1. feature ブランチを作成
2. 変更を実装
3. ビルドとテストを実行
4. main ブランチへのプルリクエストを作成

## スクリプト

### `npm run dev`

開発サーバーを起動します。

- ホットリロード有効
- http://localhost:3000 でアクセス可能

### `npm run build`

本番用ビルドを作成します。

- 静的HTMLを `out/` ディレクトリに出力
- 画像最適化、コード圧縮を実行
- ビルド成果物はS3にデプロイ可能

### `npm start`

ビルド済みのアプリケーションを起動します（静的エクスポートモードでは使用しません）。

## コーディング規約

### TypeScript

- 型推論を活用し、明示的な型注釈は必要な場合のみ
- `any` 型の使用は避ける
- インターフェースは `interface` を使用

### React / Next.js

- 関数コンポーネントを使用
- Server Components を優先（必要な場合のみ Client Components）
- ファイル名: PascalCase（コンポーネント）、kebab-case（その他）

### Chakra UI

- v3 のAPIを使用
- カスタムテーマは `providers.tsx` で定義
- レスポンシブデザインには `responsive prop` を使用

例：
```tsx
<Box display={{ base: 'block', md: 'flex' }}>
  {/* コンテンツ */}
</Box>
```

### スタイリング

- Chakra UIのコンポーネントを優先
- カスタムCSSは最小限に
- カラーパレットは Chakra UI のテーマカラーを使用

## コンテンツの編集

### トップページ

`src/app/page.tsx` を編集します。

主なセクション：
- **Header** - ナビゲーションバー
- **Hero** - メインビジュアル
- **Skills** - 技術スキルの紹介
- **Projects** - プロジェクト一覧
- **About** - サイト/自己紹介
- **Footer** - フッター

### 新しいページの追加

App Router を使用しています：

```bash
# 新しいページを作成
mkdir -p src/app/about
touch src/app/about/page.tsx
```

`src/app/about/page.tsx`:
```tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About</h1>
      {/* コンテンツ */}
    </div>
  )
}
```

## コンポーネントの作成

再利用可能なコンポーネントは `src/components/` に配置：

```tsx
// src/components/ProjectCard.tsx
import { Card, Heading, Text } from '@chakra-ui/react'

interface ProjectCardProps {
  title: string
  description: string
}

export function ProjectCard({ title, description }: ProjectCardProps) {
  return (
    <Card.Root>
      <Card.Body>
        <Heading size="lg">{title}</Heading>
        <Text>{description}</Text>
      </Card.Body>
    </Card.Root>
  )
}
```

使用例：
```tsx
import { ProjectCard } from '@/components/ProjectCard'

export default function Page() {
  return (
    <ProjectCard 
      title="プロジェクト名" 
      description="説明文"
    />
  )
}
```

## インフラストラクチャの変更

### CloudFormation テンプレートの編集

`cloudformation/infrastructure.yaml` を編集します。

変更後、スタックを更新：

```bash
aws cloudformation update-stack \
  --stack-name portfolio-infrastructure \
  --template-body file://cloudformation/infrastructure.yaml \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

### ビルドプロセスの変更

`buildspec.yml` を編集して CodeBuild の動作を変更できます。

- `install` フェーズ: 依存関係のインストール
- `pre_build` フェーズ: ビルド前の処理
- `build` フェーズ: アプリケーションのビルド
- `post_build` フェーズ: S3へのアップロードなど

## デバッグ

### ローカル環境

Next.js のビルトインデバッガーを使用：

```bash
NODE_OPTIONS='--inspect' npm run dev
```

VS Code のデバッガーと連携可能。

### 本番環境の問題

1. CloudWatch Logs でビルドログを確認
2. CloudFront のアクセスログを確認（有効化が必要）
3. WAF のメトリクスを確認

## パフォーマンス

### 画像の最適化

Next.js Image コンポーネントは静的エクスポートでは制限があります。
`next.config.js` で `unoptimized: true` を設定済み。

大きな画像は事前に最適化してから `public/` に配置してください。

### バンドルサイズ

ビルド時にバンドルサイズが表示されます：

```
Route (app)                              Size  First Load JS
┌ ○ /                                    11.8 kB         122 kB
```

サイズが大きい場合：
- 不要な依存関係を削除
- dynamic import を使用してコード分割
- tree-shaking を確認

## テスト

現在テストフレームワークは未設定です。今後追加予定：

- Jest - ユニットテスト
- React Testing Library - コンポーネントテスト
- Playwright - E2Eテスト

## CI/CD

GitHub から main ブランチへのプッシュで自動デプロイ：

1. GitHub Webhook がトリガー
2. CodePipeline 起動
3. CodeBuild でビルド
4. S3 にデプロイ
5. CloudFront キャッシュ無効化

デプロイ時間: 約 5-10 分

## よくある質問

### Q: ローカルでビルドエラーが出る

A: 依存関係を再インストールしてください：

```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: CloudFormation スタックの作成が失敗する

A: 以下を確認：
- us-east-1 リージョンを使用しているか
- IAM権限が十分か
- GitHub Token が正しいか
- パラメータが正しく設定されているか

### Q: 変更が反映されない

A: CloudFront のキャッシュをクリア：

```bash
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"
```

### Q: コストを削減したい

A: 
- CloudFront Price Class を変更（現在は PriceClass_100）
- 不要なログ記録を無効化
- WAF ルールを最小限に

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [Chakra UI Documentation](https://www.chakra-ui.com/docs)
- [AWS CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## サポート

問題や質問がある場合は、GitHub Issues で報告してください。
