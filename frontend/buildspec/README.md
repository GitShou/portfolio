# frontend/buildspec

フロントエンドの CodeBuild 用 BuildSpec を置いています。CodePipeline では `buildspec-nextjs.yml` → `buildspec-deploy-contents.yml` の順で実行します。

## ファイル
- `buildspec-nextjs.yml`
  - `.env.production` を生成
  - Playwright E2E を実行
  - `npm run build` と static export (`out/`) を生成
  - 次段のために `buildspec-deploy-contents.yml` をアーティファクトにコピー
- `buildspec-deploy-contents.yml`
  - `out/` を S3 (`/${ProjectName}/s3/static-site-bucket-name`) に `aws s3 sync`
  - ディレクトリアクセス用に `index.html` のエイリアスオブジェクト (`/foo/`) を追加
  - CloudFront invalidation は Distribution ID を SSM (`/${ProjectName}/edge/cloudfront/distribution-id`) から解決できる場合のみ実行 (未作成ならスキップ)
