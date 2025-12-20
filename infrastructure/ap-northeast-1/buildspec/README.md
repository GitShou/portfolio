# ap-northeast-1/buildspec

ap-northeast-1 の CodeBuild で使う BuildSpec です。CodePipeline (JP) から `BuildspecOverride` で呼ばれます。

## buildspec 一覧
- `buildspec-cfn.yml`
  - `infrastructure/ap-northeast-1/Lambda` のユニットテストを実行
  - `infrastructure/ap-northeast-1/templates/*.yml` を `aws cloudformation package` して `*.packaged.yml` を生成
  - secondary artifacts として `PackagedTemplates` / `WebArtifact` / `DataArtifact` などを出力
- `buildspec-pre-cfn.yml`
  - `ROLLBACK_*` / `*_FAILED` の CloudFormation スタックを削除して再デプロイしやすくする
- `buildspec-seed-projects.yml`
  - SSM から `PROJECTS_API_BASE_URL` を取得し、TypeScript の seed スクリプトで DynamoDB を upsert
