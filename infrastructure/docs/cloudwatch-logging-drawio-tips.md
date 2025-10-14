# ログ・モニタリング要素の追記案（drawio用テキスト構成）

- CloudWatch Logs
  - API Gateway、Lambda、CodeBuild、CodeDeploy、WAF、CloudFront、S3（アクセスログ）など各リソースからログを集約
- CloudWatch Alarms
  - Lambdaエラー、API Gateway 5xx、DynamoDBスロットリング、WAF検知などのアラート
- CloudWatch Dashboard
  - 各種メトリクスの可視化
- SNS（通知）
  - アラーム発報時のメール・Slack通知

---

【drawio図への追記例】
- 各リソース（API Gateway, Lambda, WAF, CloudFront, S3, CodeBuild, CodeDeploy）からCloudWatch Logsへ矢印
- CloudWatch LogsからCloudWatch Alarms、Dashboardへ分岐
- CloudWatch AlarmsからSNS（通知）へ矢印

【drawioアイコン例】
- CloudWatch（logs, alarm, dashboard）
- SNS（通知）

---

この内容を参考にdrawioで「CloudWatch Logs/Alarms/Dashboard/SNS」を追加し、各リソースからCloudWatch Logsへの矢印を描画してください。
