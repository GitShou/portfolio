# us-east-1/templates

us-east-1 でデプロイする CloudFormation/SAM テンプレートです。

## テンプレート
- `CloudFrontWafWebAcl.yml`
  - CloudFront 用 WAFv2 WebACL
  - viewer-request Lambda@Edge (URL リライト)

このテンプレートのデプロイ結果 (ARN) は ap-northeast-1 側の Edge スタックで参照するため、SSM へ書き戻します。
