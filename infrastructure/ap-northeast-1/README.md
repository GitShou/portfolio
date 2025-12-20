# ap-northeast-1

このディレクトリは ap-northeast-1 でデプロイするリソース一式 (Backend / 静的サイト用 S3 / Edge スタックのテンプレートなど) をまとめています。

## ディレクトリ
- `templates/`: CloudFormation/SAM テンプレート
- `buildspec/`: CodeBuild 用 buildspec
- `Lambda/`: Backend 用 Lambda ソースとユニットテスト
- `scripts/`: Seed スクリプト (TypeScript)
- `data/`: `ProjectData.ts` (正データ)
- `error/`: CloudFront のカスタムエラーページ (`error.html`)

## 主なテンプレート
- `templates/portfolio-backend.yml`: API Gateway + Lambda + DynamoDB
- `templates/portfolio-frontend.yml`: 静的サイト用 S3 バケット + バケット名の SSM 登録
- `templates/error-template.yml`: エラーページ用 S3 バケット + バケット名の SSM 登録
- `templates/route53-template.yml`: Route53 + CloudFront (ログ/Glue/Athena も含む)

## 依存関係 (SSM)
`templates/route53-template.yml` は WAF/Lambda@Edge/ACM/HostedZoneId などを SSM から参照し、CloudFront Distribution ID を `/${ProjectName}/edge/cloudfront/distribution-id` に書き戻します。
