# infrastructure ディレクトリ概要

`infrastructure/` にはポートフォリオシステムを AWS 上に再現するための IaC・スクリプト・設計資料がまとまっています。ap-northeast-1 (メイン) と us-east-1 (CloudFront/WAF) のクロスリージョン構成を意識したフォルダ分けになっています。

## ディレクトリ構成

### docs/
- `アーキテクチャ図.drawio` – 全体構成図。
- `dynamodb-projects-table.md` – テーブル設計や GSI の考え方。
- CloudWatch ロギングのメモなど、IaC を補完する設計ドキュメント。

### ap-northeast-1/
| フォルダ | 役割 |
| --- | --- |
| `templates/` | SAM/CloudFormation テンプレート。`portfolio-backend.yml` (Backend)、`portfolio-frontend.yml` (静的サイト用バケット)、`error-template.yml` (エラーページ用バケット)、`route53-template.yml` (Route53+CloudFront) を配置。 |
| `buildspec/` | CodeBuild で使う BuildSpec。`buildspec-cfn.yml`、`buildspec-pre-cfn.yml`、`buildspec-seed-projects.yml` など。 |
| `Lambda/` | 各 Lambda 関数の Node.js 22 ソース (`get-projects`, `create-project`, `parameter-writer-wrapper` など)。`npm test` で DynamoDB モックを用いたユニットテストを実行できます。 |
| `scripts/` | `seed-projects.ts` を含む TypeScript スクリプト。`tsconfig.seed.json` でコンパイル設定を分離。 |
| `data/ProjectData.ts` | プロジェクト情報の Canonical データ。フロントエンドのモックやシードスクリプトがここを参照します。 |

#### 主なテンプレート
- `portfolio-backend.yml`
  - DynamoDB (`${ProjectName}-projects-v1`) と 2 つの GSI。
  - Node.js 22 の Lambda 関数 5 種 (CRUD API)。
  - API Gateway (ステージ別ログ、IAM 認証)。
  - `ParameterWriterWrapperFunction` で SSM に `/ProjectName/api/base-url` を自動登録。
- `portfolio-frontend.yml`
  - 静的サイト用 S3 バケットを作成。
  - バケット名を SSM (`/${ProjectName}/s3/static-site-bucket-name`) に登録。
- `error-template.yml`
  - エラーページ用 S3 バケットを作成。
  - バケット名を SSM (`/${ProjectName}/error/page/s3/bucket-name`) に登録。
- `route53-template.yml`
  - Route53 + CloudFront (CloudFront ログ用 S3、Glue/Athena、日次 Parquet 変換の Lambda/EventBridge を含む) を作成。
  - WAF WebACL ARN / Lambda@Edge Version ARN / ACM 証明書 ARN / Hosted Zone ID / バケット名は SSM パラメータから取得。
  - CloudFront Distribution ID / DomainName を SSM (`/${ProjectName}/edge/cloudfront/...`) に登録。

#### BuildSpec まとめ
- `buildspec-cfn.yml`: Lambda 単体テスト → `aws cloudformation package` (backend/frontend/route53) → `PackagedTemplates` / `WebArtifact` / `DataArtifact` などのアーティファクト化。
- `buildspec-pre-cfn.yml`: ROLLBACK/FAILED の Stack を削除して再デプロイを安全に実施。
- `buildspec-seed-projects.yml`: `PROJECTS_API_BASE_URL` を Parameter Store から取得し、API 経由で DynamoDB を upsert。

### us-east-1/
| フォルダ | 役割 |
| --- | --- |
| `templates/CloudFrontWafWebAcl.yml` | CloudFront 向け WAFv2 WebACL と viewer-request Lambda@Edge (クリーン URL リライト) を定義。 |
| `Lambda/src/cloudfront-viewer-request/` | HTML 拡張子やディレクトリアクセスを `index.html` に書き換える Lambda@Edge コード。 |
| `buildspec/packaging-template.yml` | us-east-1 リージョンのテンプレートを `sam package` する CodeBuild 用スクリプト。 |
| `buildspec/buildspec-put-waf-arn.yml` | WebACL/Lambda@Edge ARN を ap-northeast-1 の SSM Parameter Store へ書き戻し、必要に応じて EventBridge で通知。 |

### Pipeline/
- `template/portfolio-codepipeline-JP.yml` / `...US.yml` が CodePipeline 定義を IaC 化。GitHub (CodeStar Connections) をソースにし、CodeBuild を使って CloudFormation / Next.js / データシードを順番に処理します。

## 依存する SSM パラメータ
| パス | 用途 | 例 |
| --- | --- | --- |
| `/portfolio/waf/arn` | CloudFront 用 WebACL ARN (us-east-1) | `arn:aws:wafv2:us-east-1:...:global/webacl/...` |
| `/portfolio/ViewerRequestRewriteFunctionVersion/arn` | Lambda@Edge バージョン ARN | `arn:aws:lambda:us-east-1:...:function:...:live` |
| `/portfolio5352/api/base-url` | API Gateway のベース URL。ParameterWriterWrapper が自動登録 | `https://xxxx.execute-api.ap-northeast-1.amazonaws.com/prod` |
| `/portfolio5352/s3/static-site-bucket-name` | 静的サイトバケット名 | `portfolio5352-static-site` |
| `/portfolio5352/error/page/s3/bucket-name` | エラーページバケット名 | `portfolio5352-error-pages` |
| `/portfolio5352/edge/cloudfront/distribution-id` | CloudFront Distribution ID | `E1234567890` |
| `/portfolio5352/edge/cloudfront/distribution-domain-name` | CloudFront Distribution DomainName | `xxxx.cloudfront.net` |
| `/acm/mydomain/arn` | CloudFront 用 ACM 証明書 (us-east-1) | `arn:aws:acm:us-east-1:...` |
| `/Route53/hostzone/id` | Route53 Hosted Zone ID | `Z0123456789ABC` |
| `/portfolio/SSM/parameter-writer/function-arn` | 既存の Parameter Writer Lambda の ARN | `arn:aws:lambda:ap-northeast-1:...:function:parameter-writer` |

> `ProjectName` を変更する場合は `/portfolio5352/...` のパスも合わせて変更してください。CodeBuild/CodePipeline のパラメータも同じパスを参照します。

## 推奨デプロイ手順 (手動)
1. **us-east-1**  
   `sam deploy --template-file infrastructure/us-east-1/templates/CloudFrontWafWebAcl.yml --region us-east-1 --stack-name Portfolio-Edge`  
   出力された WebACL ARN / Lambda@Edge ARN を Parameter Store へ保存 (もしくは `buildspec-put-waf-arn.yml` を CodeBuild で実行)。
2. **ap-northeast-1 - Backend**  
   `sam deploy --template-file infrastructure/ap-northeast-1/templates/portfolio-backend.yml --stack-name Portfolio-Backend --capabilities CAPABILITY_NAMED_IAM`  
   スタック完了後に SSM の `/ProjectName/api/base-url` が自動で作成されます。
3. **ap-northeast-1 - S3 Buckets**  
   `portfolio-frontend.yml` (静的サイト) と `error-template.yml` (エラーページ) をデプロイし、S3 バケット名を SSM に登録します。
4. **ap-northeast-1 - Edge (Route53 + CloudFront)**  
   `route53-template.yml` をデプロイして Route53 レコードと CloudFront Distribution を作成します (WAF/Lambda@Edge/ACM/HostedZoneId/バケット名は SSM 参照)。作成後、Distribution ID が SSM (`/${ProjectName}/edge/cloudfront/distribution-id`) に保存されます。
5. **コンテンツ配信**  
   `frontend/` で `npm run build && npm run export` → `aws s3 sync out/ s3://<bucket> --delete`。CloudFront Invalidation は SSM から Distribution ID を解決できる場合のみ実行します (未作成の場合はスキップ)。CodePipeline を利用する場合は `buildspec-nextjs.yml` + `buildspec-deploy-contents.yml` が同処理を自動化します。
6. **データシード**  
   `infrastructure/ap-northeast-1/scripts/seed-projects.ts` を実行して DynamoDB を API 経由で upsert。CodePipeline では `buildspec-seed-projects.yml` が行います。

## シードスクリプトの使い方
```bash
cd infrastructure/ap-northeast-1/scripts
npm ci
export PROJECTS_API_BASE_URL="https://xxxx.execute-api.ap-northeast-1.amazonaws.com/prod"
npx tsc --project ./tsconfig.seed.json
node dist/scripts/seed-projects.js
```
- API が IAM 認証付きの場合でも、SigV4 署名を自動で付与します。
- DynamoDB の `metadata.order` は `ProjectData.ts` の並び順をもとに 1 から採番します。

## メンテナンスポイント
- CloudFormation スタックが `ROLLBACK_*` や `*_FAILED` で止まった場合は `buildspec-pre-cfn.yml` を CodeBuild で実行するか、同等の手順で削除してから再デプロイしてください。
- `docs/` の draw.io / Markdown を更新したら、ここ (README) からのリンクも忘れずに更新します。
- WAF/Lambda@Edge は us-east-1 でのみ更新可能です。コード変更後は `sam build` → `sam deploy` → `buildspec-put-waf-arn.yml` で ARN を再登録します。

---
この README はインフラ構成を変更した際に必ず更新し、IaC と実環境の差分が生まれないようにしてください。
