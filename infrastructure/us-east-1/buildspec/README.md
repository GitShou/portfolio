# us-east-1/buildspec

us-east-1 でのみ更新する CloudFront 用 WAF/Lambda@Edge の CI/CD 用 BuildSpec です。

## buildspec 一覧
- `packaging-template.yml`
  - `infrastructure/us-east-1/templates/CloudFrontWafWebAcl.yml` を `aws cloudformation package` してデプロイ用テンプレートを生成
- `buildspec-put-waf-arn.yml`
  - デプロイ結果の WebACL ARN / Lambda@Edge Version ARN を ap-northeast-1 の SSM に書き戻す
