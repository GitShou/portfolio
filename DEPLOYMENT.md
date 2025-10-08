# AWS デプロイメントガイド

このガイドでは、ポートフォリオサイトをAWSにデプロイする手順を説明します。

## 前提条件

- AWS CLIがインストールされ、設定されていること
- 適切なAWS権限があること（CloudFormation、S3、CloudFront、CodePipeline、CodeBuild、WAF、IAM）
- GitHub Personal Access Tokenがあること

## デプロイ手順

### 1. GitHub Personal Access Tokenの作成

1. GitHubにログインし、Settings > Developer settings > Personal access tokens > Tokens (classic) に移動
2. "Generate new token (classic)" をクリック
3. トークンの名前を入力（例: "portfolio-codepipeline"）
4. 以下のスコープを選択：
   - `repo` - Full control of private repositories
   - `admin:repo_hook` - Full control of repository hooks
5. "Generate token" をクリック
6. 生成されたトークンをコピーして安全な場所に保存

### 2. CloudFormationスタックのデプロイ

#### オプションA: AWS CLIを使用

```bash
# 環境変数を設定
export GITHUB_TOKEN="your_github_token_here"
export STACK_NAME="portfolio-infrastructure"

# スタックを作成
aws cloudformation create-stack \
  --stack-name ${STACK_NAME} \
  --template-body file://cloudformation/infrastructure.yaml \
  --parameters \
    ParameterKey=GitHubRepo,ParameterValue=GitShou/portfolio \
    ParameterKey=GitHubBranch,ParameterValue=main \
    ParameterKey=GitHubToken,ParameterValue=${GITHUB_TOKEN} \
  --capabilities CAPABILITY_IAM \
  --region us-east-1

# デプロイの進行状況を確認
aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --region us-east-1 \
  --query 'Stacks[0].StackStatus'
```

#### オプションB: AWSマネジメントコンソールを使用

1. AWSマネジメントコンソールにログイン
2. us-east-1リージョン（バージニア北部）に切り替え
3. CloudFormationサービスに移動
4. "スタックの作成" をクリック
5. "テンプレートの指定" で "テンプレートファイルのアップロード" を選択
6. `cloudformation/infrastructure.yaml` ファイルをアップロード
7. パラメータを入力：
   - スタック名: `portfolio-infrastructure`
   - GitHubRepo: `GitShou/portfolio`
   - GitHubBranch: `main`
   - GitHubToken: 作成したGitHub Personal Access Token
8. "次へ" をクリックし、IAM機能の承認にチェックを入れて作成

### 3. デプロイの確認

スタックの作成が完了したら（約10-15分）、出力を確認します：

```bash
aws cloudformation describe-stacks \
  --stack-name portfolio-infrastructure \
  --region us-east-1 \
  --query 'Stacks[0].Outputs'
```

出力例：
```json
[
  {
    "OutputKey": "CloudFrontURL",
    "OutputValue": "d1234567890abc.cloudfront.net",
    "Description": "CloudFront Distribution URL"
  },
  {
    "OutputKey": "WebsiteBucketName",
    "OutputValue": "portfolio-infrastructure-website-123456789012",
    "Description": "S3 Bucket for website hosting"
  },
  {
    "OutputKey": "PipelineName",
    "OutputValue": "portfolio-infrastructure-pipeline",
    "Description": "CodePipeline Name"
  }
]
```

### 4. 初回デプロイの実行

CodePipelineを手動で開始するか、mainブランチにコミットをプッシュします：

```bash
# 手動でパイプラインを開始
aws codepipeline start-pipeline-execution \
  --name portfolio-infrastructure-pipeline \
  --region us-east-1
```

または

```bash
# 空コミットをプッシュしてトリガー
git commit --allow-empty -m "Trigger initial deployment"
git push origin main
```

### 5. サイトへのアクセス

CloudFront URLを使用してサイトにアクセスします：

```
https://d1234567890abc.cloudfront.net
```

## 自動デプロイ

以降、mainブランチに変更をプッシュすると自動的に以下が実行されます：

1. GitHub Webhookがトリガーされる
2. CodePipelineが起動
3. ソースコードがチェックアウトされる
4. CodeBuildでビルド実行
   - npm ci で依存関係をインストール
   - npm run build でNext.jsをビルド
   - S3に成果物をアップロード
   - CloudFrontのキャッシュを無効化
5. 数分後に変更が反映される

## トラブルシューティング

### パイプラインが失敗する場合

CodeBuildのログを確認：

```bash
# 最新のビルドIDを取得
BUILD_ID=$(aws codebuild list-builds-for-project \
  --project-name portfolio-infrastructure-build \
  --max-items 1 \
  --query 'ids[0]' \
  --output text)

# ビルドログを確認
aws codebuild batch-get-builds \
  --ids ${BUILD_ID} \
  --query 'builds[0].logs'
```

### CloudFrontのキャッシュをクリア

変更が反映されない場合：

```bash
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name portfolio-infrastructure \
  --region us-east-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
  --output text)

aws cloudfront create-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --paths "/*"
```

### GitHub Webhookの問題

Webhookが動作しない場合、手動で再作成：

```bash
# スタックを更新して再作成
aws cloudformation update-stack \
  --stack-name portfolio-infrastructure \
  --use-previous-template \
  --parameters \
    ParameterKey=GitHubRepo,UsePreviousValue=true \
    ParameterKey=GitHubBranch,UsePreviousValue=true \
    ParameterKey=GitHubToken,ParameterValue=${GITHUB_TOKEN} \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

## カスタムドメインの設定

カスタムドメインを使用する場合：

1. Route 53でホストゾーンを作成
2. ACM証明書を作成（us-east-1リージョンで）
3. CloudFormationテンプレートを更新してドメイン設定を追加
4. スタックを更新

詳細は別途ドキュメントを参照してください。

## コスト見積もり

以下は月間の概算コスト（使用量による）：

- **S3**: ~$0.023/GB（ストレージ） + $0.09/GB（転送）
- **CloudFront**: 最初の10TBは$0.085/GB
- **CodeBuild**: $0.005/分（ビルド時間）
- **CodePipeline**: 最初のアクティブパイプラインは無料、以降$1/月
- **WAF**: $5/月 + $1/ルール
- **CloudFormation**: 無料

小規模サイトの場合、月額$10-20程度の見込みです。

## セキュリティのベストプラクティス

1. **GitHub Tokenの管理**
   - トークンは定期的にローテーション
   - 不要なスコープは削除
   - AWS Secrets Managerへの移行を検討

2. **WAFルールの調整**
   - アクセスログを確認
   - 必要に応じてレート制限を調整
   - カスタムルールの追加

3. **S3バケットポリシー**
   - パブリックアクセスはブロックのまま
   - CloudFront OACのみアクセス許可

4. **CloudFront**
   - HTTPSのみアクセス許可
   - ログ記録を有効化（オプション）

## スタックの削除

テスト後にリソースを削除する場合：

```bash
# S3バケットを空にする
aws s3 rm s3://portfolio-infrastructure-website-{ACCOUNT_ID} --recursive
aws s3 rm s3://portfolio-infrastructure-artifacts-{ACCOUNT_ID} --recursive

# スタックを削除
aws cloudformation delete-stack \
  --stack-name portfolio-infrastructure \
  --region us-east-1
```

**注意**: CloudFront distributionの削除には時間がかかる場合があります（最大1時間）。

## サポート

問題が発生した場合は、以下を確認してください：

- CloudFormationスタックのイベントログ
- CodeBuildのビルドログ
- CloudWatchログ
- WAFのメトリクス

詳細はAWS公式ドキュメントを参照してください。
