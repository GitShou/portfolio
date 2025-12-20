# us-east-1

このディレクトリは us-east-1 でのみ更新できるリソース (CloudFront 向け WAF/Lambda@Edge) を管理します。

## 内容
- `templates/CloudFrontWafWebAcl.yml`
  - WAFv2 WebACL (CloudFront 用) を作成
  - viewer-request Lambda@Edge (クリーン URL / `index.html` リライト) のバージョン ARN を出力
- `buildspec/`
  - `packaging-template.yml`: `aws cloudformation package` 用
  - `buildspec-put-waf-arn.yml`: デプロイ結果の ARN を ap-northeast-1 の SSM へ書き戻す

## 連携
ap-northeast-1 側の Edge スタック (`infrastructure/ap-northeast-1/templates/route53-template.yml`) が、ここで作った ARN を SSM 経由で参照して CloudFront に紐付けます。
