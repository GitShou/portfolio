# Pipeline

`Pipeline/template/` には CodePipeline 定義を CloudFormation として IaC 化したテンプレートを置いています。
どちらも「既存のパイプライン設定をエクスポートしたもの」で、CodeBuild プロジェクトや IAM ロール、CodeStar Connections は事前作成済みである前提です。

## テンプレート
- `template/portfolio-codepipeline-JP.yml`
  - ap-northeast-1 向けのメインパイプライン
  - 役割: テンプレートの packaging → Backend/Frontend(バケット) のデプロイ → Next.js build + Playwright → S3 配信 → DynamoDB Seed
  - 主なアーティファクト:
    - `PackagedTemplates` (packaged テンプレート一式)
    - `WebArtifact` (Next.js ソース一式)
    - `DataArtifact` (Seed 用スクリプト/データ)
    - `WebContents` (`out/` と `buildspec-deploy-contents.yml`)
- `template/portfolio-codepipeline-US.yml`
  - us-east-1 向けの補助パイプライン
  - 役割: `CloudFrontWafWebAcl.yml` の packaging + デプロイ → 生成 ARN を ap-northeast-1 側の SSM へ書き戻し

## 補足
- Edge スタック (Route53 + CloudFront) は `infrastructure/ap-northeast-1/templates/route53-template.yml` で定義され、`buildspec-cfn.yml` で `route53-template.packaged.yml` まで生成しますが、JP テンプレートにはデプロイアクションを入れていません。
  - 自動化したい場合は `PackagedTemplates::route53-template.packaged.yml` をデプロイする CloudFormation アクションを追加してください。
