export const PROJECTS_DATA = [
  {
    id: 1,
    title: "AWSサーバーレス研修管理システム移行",
    summary: "オンプレミスの研修管理システムをAWSサーバーレス（API Gateway, Lambda, DynamoDB等）へ移行。Google認証連携やREST API化も担当。リーダーとして設計・構築・運用を主導。",
    techStack: ["AWS API Gateway", "Lambda", "DynamoDB", "CloudFront", "S3", "Cognito", "Node.js", "Google Apps Script"],
    // --- 詳細ページ用の拡張情報 ---
    detail: {
      background: "既存システムのサーバー老朽化、アプリケーションのサポート切れ、UIの使いにくさによる社員の活用不足。",
      goal: "AWS上でサーバレスアプリケーションとしてシステムをリプレース。社員はチャットボット（iPhoneからも利用可能）で手軽に実績登録、育成担当はWebアプリで効率的に管理。",
      mainTechThemes: [
        "AWS Lambda中心のサーバーレスアーキテクチャ",
        "チャットボットとWebアプリの二軸サービス",
        "CI/CD環境のフル自動化",
        "G Suite（Google OpenID Connect）認証"
      ],
      challenges: [
        {
          title: "ステートレスな環境での会話状態管理",
          description: "Lambdaはイベント駆動型で会話状態を保持できない",
          solution: "DynamoDBに会話状態（user_id, intent_id, session）を格納・管理するロジックを独自実装"
        },
        {
          title: "レスポンス速度の根本的な問題解決",
          description: "チャットボット応答が4秒と遅い",
          solution: "全体の実行時間を計測し、Lambdaのメモリ増強（128MB→512MB）で0.1秒まで短縮"
        },
        {
          title: "クラウド依存環境でのローカル開発",
          description: "Lambda関数のテストが困難",
          solution: "SAM LocalとDynamoDBローカルをDockerで組み合わせ、本番同等のローカル環境を構築"
        }
      ],
      security: [
        {
          category: "認証・認可",
          point: "Cognito+Google OpenID Connect連携でG Suite認証。AWSの複雑な認証基盤を実装し、セキュリティとユーザビリティを両立"
        },
        {
          category: "アクセス制御",
          point: "WAF/CloudFront/API Gatewayによる多層的なアクセス制御。正当な権利者のみ利用可能な堅牢な防御策を設計・実装"
        },
        {
          category: "CI/CD",
          point: "CodeCommit/CodePipeline/CodeBuild/CloudFormationのフルセット。Git-flowモデルとIaCで複数環境デプロイを自動化"
        }
      ],
      outcomes: [
        "サーバーレスによる開発効率化と運用コスト削減",
        "チャットボットによる実績登録の簡略化",
        "ローカル開発環境の構築とナレッジ共有",
        "根本的な課題解決力・R&D能力・説明スキルを社内外で発揮"
      ],
      presentation: "本プロジェクトの内容を「AWS Lambdaを使った サーバレスのアプリケーション開発」として資料化し、社外フォーラムで発表。複雑な技術課題を体系的に整理し、他者に分かりやすく伝えるスキルも証明。"
    }
    // --- ここまで詳細ページ用の拡張情報 ---
  },
  {
    id: 2,
    title: "AWSハンズオン研修企画・講師",
    summary: "AWSサーバーレスやCI/CDをテーマにした技術研修を企画・資料作成・講師として実施。社内外70名以上に登壇し高評価を獲得。",
    techStack: ["AWS Lambda", "API Gateway", "DynamoDB", "CloudFormation", "CodeCommit", "CodeBuild"],
  },
  {
    id: 3,
    title: "社内技術情報共有システム立ち上げ",
    summary: "OSSを活用した社内ナレッジ共有Webシステムを構築・運用。リーダーとして社内コンテスト最優秀賞を獲得。広報・利用促進も担当。",
    techStack: ["Ubuntu", "Tomcat", "PostgreSQL", "OSS"],
  },
  {
    id: 4,
    title: "AWSリソース棚卸・コスト最適化支援",
    summary: "数千リソースのAWS環境をTag Editor等で棚卸し、コスト最適化・タグ設計・運用改善を実施。フリーランスとして単独で担当。",
    techStack: ["AWS Billing", "Cost Explorer", "Tag Editor"],
  },
  {
    id: 5,
    title: "公演結果自動共有サービス基盤構築",
    summary: "AWS Athena/Glue/S3を活用し、クライアントの配信結果を自動集計・共有する基盤を設計・構築。リーダーとしてチームを牽引。",
    techStack: ["AWS Athena", "Glue", "S3", "CloudWatch"],
  },
  {
    id: 6,
    title: "業務自動化プログラム開発",
    summary: "事務スタッフの定型業務を自動化するプログラムを開発し、作業時間を大幅短縮。現場の業務効率化に貢献。",
    techStack: ["スクリプト言語", "自動化"],
  },
  // 他のプロジェクトデータを追加...
];