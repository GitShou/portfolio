# ap-northeast-1/error

CloudFront のカスタムエラーページとして返す静的 HTML を置いています。

## ファイル
- `page/error.html`: `templates/error-template.yml` が作成するエラーページ用 S3 バケットにアップロードします。

## 関連
- `infrastructure/ap-northeast-1/templates/route53-template.yml` の `CustomErrorResponses` が `/error.html` を参照します。
