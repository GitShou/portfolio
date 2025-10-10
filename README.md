# portfolio
就職活動用に自分の技術的な経歴や実績を記したポートフォリオを作成するプロジェクト
Webページとして公開し誰でも閲覧できるようにする。
必要なものはすべてAWS上で公開し、ビルドなどもすべてAWS上で完結できるようにする。

本プロジェクトで重視する技術テーマは下記の通り
・IaC
・サーバーレス

本システムのアーキテクチャは次の通り。
- バージョン管理/リポジトリ -
Git + GitHub

- フロントエンド -
Next.js + ChakraUI

- バックエンド(AWS) -
lambda
ApiGateway
DynamoDB
CloudFront
WAF

- CI/CD -
Code Pipeline
Code Build
Code Deploy
Cloud Formation