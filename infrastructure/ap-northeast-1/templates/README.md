# ap-northeast-1/templates

ap-northeast-1 にデプロイする CloudFormation/SAM テンプレートです。

## テンプレート
- `portfolio-backend.yml`: API Gateway + Lambda + DynamoDB + SSM Parameter Writer
- `portfolio-frontend.yml`: 静的サイト用 S3 バケット + SSM (`/${ProjectName}/s3/static-site-bucket-name`)
- `error-template.yml`: エラーページ用 S3 バケット + SSM (`/${ProjectName}/error/page/s3/bucket-name`)
- `route53-template.yml`: Route53 + CloudFront + ログ分析基盤 (Glue/Athena/Lambda/EventBridge) + SSM (`/${ProjectName}/edge/cloudfront/*`)

## packaging について
CodeBuild の `infrastructure/ap-northeast-1/buildspec/buildspec-cfn.yml` は各テンプレートを `aws cloudformation package` し、`*.packaged.yml` を `PackagedTemplates` アーティファクトとして出力します。
