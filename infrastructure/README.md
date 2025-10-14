# infrastructure ディレクトリ構成と運用方針

このディレクトリはAWSインフラ（IaC）管理用です。CloudFormation等のテンプレート、運用スクリプト、設計ドキュメントを用途ごとに整理します。

## ディレクトリ構成

- templates/ ・・・ CloudFormation等の主要テンプレート（ネットワーク、バックエンド、フロントエンド、CI/CD等）
- modules/    ・・・ 再利用可能なIaCモジュール（Terraform/CDK等の場合）
- scripts/    ・・・ デプロイ・検証・補助スクリプト
- params/     ・・・ パラメータファイル（CloudFormation parameters.json等）
- docs/       ・・・ 構成図・設計書・運用手順などのドキュメント

## 運用方針

- まずは最小限の基本構成（S3, CloudFront, WAF, API Gateway, Lambda, DynamoDB, CI/CD）を優先的にIaC化
- 実運用・検証後、CloudWatchログ・監視やセキュリティ強化など+α設計を段階的に追加
- テンプレートは用途ごとに分割し、パラメータ化・条件分岐で拡張性を確保
- ドキュメント・設計図もdocs/に集約し、構成の可視化・共有を徹底

## 注意事項

- バックエンド実装・AWSリソース構築は必ずユーザー指示のもとで進める
- 機密情報（APIキー等）はparams/やSecrets Manager等で安全に管理
- 不要な一時ファイル・バックアップファイルは.gitignoreで除外

---

このREADMEは随時アップデートしてください。
