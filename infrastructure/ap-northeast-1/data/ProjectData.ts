// 型定義
export type ProjectSection = {
  heading?: string;
  body?: string;
  list?: string[];
  image?: string;
};

export type ProjectDetail = {
  type: string;
  pdf?: string;
  sections: ProjectSection[];
  role?: string;
  tasks?: string[];
  features?: string[];
  architectureUrl?: string;
  improvements?: { title: string; description: string }[];
};

export type Project = {
  id: number;
  title: string;
  summary: string;
  techStack: { name: string; icon: string }[];
  detail?: ProjectDetail;
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    title: "技術ポートフォリオ Web サイト構築",
    summary:
      "サーバーレスと自動化を最優先に据え、短期間でフルスタック開発を形にしたプロジェクト。\n学習・設計・実装を高速化するためAIを積極活用し、特にフロントエンドはAIに一任して自身の強みであるアーキテクチャ設計・クラウド運用・セキュリティ強化に集中",
    techStack: [
      { name: "Next.js", icon: "" },
      { name: "TypeScript", icon: "" },
      { name: "Chakra UI", icon: "" },
      { name: "AWS API Gateway", icon: "/aws-icons/api-gateway_64.svg" },
      { name: "AWS Lambda", icon: "/aws-icons/lambda_64.svg" },
      { name: "Amazon DynamoDB", icon: "/aws-icons/dynamodb_64.svg" },
      { name: "Amazon CloudFront", icon: "/aws-icons/cloudfront_64.svg" },
      { name: "Amazon S3", icon: "/aws-icons/s3_64.svg" },
      { name: "AWS CodePipeline", icon: "/aws-icons/codebuild_64.svg" }
    ],
    detail: {
      type: "portfolio",
      role: "フルスタックエンジニア / アーキテクト / クラウドネイティブ開発者",
      tasks: [
        "Next.js 15 App Router + Chakra UI による UI 設計・実装",
        "API Gateway + Lambda + DynamoDB によるプロジェクトデータ API 設計",
        "CodePipeline / CodeBuild / CloudFormation による CI/CD パイプライン構築",
        "Playwright による E2E テスト自動化とビルドパイプラインへの組み込み",
        "AI 共創のワークフロー設計とフロントエンド開発の全面的な委譲管理"
      ],
      features: [
        "フロントエンド実装をAIに一任し、人はアーキテクチャと品質レビューに集中する体制",
        "サーバーレス（API Gateway / Lambda / DynamoDB）とInfrastructure as Codeによる再現性の高い運用",
        "CodePipeline / CodeBuild でテスト・デプロイ・シーディングまで完全自動化",
        "CloudFront + WAF + IAM 認証で多層防御を実装し、WAN 公開APIの堅牢性を確保"
      ],
      sections: [
        {
          heading: "プロジェクト概要",
          body:
            "求職・案件獲得活動向けに、クラウドネイティブ技術力を提示するポートフォリオサイトを短期間で構築。\nサーバーレス構成とIaCで運用負荷を極小化し、生成AIを活用して学習・設計・実装サイクルを高速化。フロントエンド開発はAIに全面委任し、人はアーキテクチャ設計・セキュリティ・自動化の高度な判断に注力した。"
        },
        {
          heading: "システム構成とアーキテクチャ",
          body: `限られた開発期間の中で、設計・実装・運用まで一気通貫で進めるため、取捨選択を徹底。
フロント・バックエンドを明確に分離し、API Gateway＋Lambda＋DynamoDBによるサーバーレスなバックエンドを積極的に設計。
CI/CDはCodePipeline/CodeBuild/CloudFormationで全自動化し、テスト（Playwright E2E）もパイプラインに組み込み。
CloudFront＋S3による静的配信とWAF/IAMによる多層セキュリティを実装し、APIはWANに配置しつつ、IAM認証を必須とすることで堅牢性を確保。`,
          list: [
            "Next.js(App Router)をoutput: exportで静的書き出しし、CloudFront + S3で配信",
            "API Gateway + Lambda + DynamoDBによるプロジェクトデータAPI（VPC内限定）",
            "CodePipeline/CodeBuild/CloudFormationによるCI/CD自動化と多段テスト",
            "PlaywrightによるE2Eテスト自動化と成果物アーティファクト化",
            "WAF, CloudFront, IAMなどAWS標準サービスを活用した多層セキュリティ"
          ],
          image: "img/portfolio-architecture.svg"
        },
        {
          heading: "セキュリティ戦略",
          list: [
            "API Gateway を IAM 認証必須とし、利用者を限定したままWAN公開を実現",
            "CloudFront + AWS WAF で攻撃面を最小化し、静的配信とAPI経路を統合",
            "DynamoDB へのアクセスは Lambda 経由に限定し、最小権限のIAMロールで統制",
            "デプロイ後のリソース識別子をSSM Parameter Storeに登録して、他スタックから安全に参照"
          ]
        },
        {
          heading: "開発プロセスと品質向上",
          list: [
            "Playwright + json-server による E2E テストをローカルと CI の両方で自動実行",
            "CodeBuild でのマルチアーティファクト出力 (静的サイト + テスト結果)",
            "環境変数と .env 管理により、本番 API とローカルモックを切り替え",
            "GitHub Actions ではなく AWS CodePipeline を採用し、AWS サービスで完結",
            "SSM Parameter Writer でデプロイ後のARNやURLを自動登録し、後続処理を省力化"
          ]
        },
        {
          heading: "AI活用と分業設計",
          body:
            "要件整理やアーキテクチャ設計・セキュリティポリシー・CI/CD 整備といった判断領域は人間が担い、実装やドキュメント作成では GitHub Copilot を主体とした AI にコーディング支援・改善検討を委譲。特にフロントエンドはAIに全面委任し、レビューと最終調整のみ人が行うことで、クラウドアーキテクチャ・自動化・セキュリティ強化に時間を投下できた。",
          list: [
            "UI 実装・テストコードのたたき台生成を AI に任せ、品質検証と最終調整を人間が担当",
            "バックエンドや IaC に関する変更は人間が設計判断を行い、AI は補助的にコード生成を実施",
            "AI との分業ルールを明文化し、レビュー観点と手戻りリスクを低減",
            "学習→AI生成→レビュー→自動テストのループで改善スピードを最大化"
          ]
        },
        {
          heading: "開発期間と工数",
          list: [
            "平日に 1 日平均 3 時間の開発時間を確保",
            "AI 支援を活用したことで短時間でも生産性を維持し、約 1 か月で MVP を完成",
            "フェーズを区切りながら継続的に改善し、公開後も追加機能を段階的に投入"
          ]
        },
        {
          heading: "成果・学び",
          list: [
            "フロント/バック/CI/CD を横断したフルスタックな設計力の可視化",
            "Next.js 15 の最新仕様 (app, static export, eslint 連携) へのキャッチアップ",
            "CI 上でのブラウザ自動テスト導入による品質担保体制の整備",
            "IaC を通じた再現性の高いクラウド環境構築",
            "AIに任せる領域と人間が担う領域の境界を明確化し、短期間での成果最大化"
          ],
          body:
            "ポートフォリオ公開後は、CloudFront からの配信確認や CodePipeline での自動更新がスムーズに実行できるようになり、セキュアかつ自動化された運用基盤を維持しながら継続的な改善・機能追加を進められるようになった。"
        }
      ],
      improvements: [
        {
          title: "Playwright テストの CI 組み込み",
          description:
            "CodeBuild でのブラウザ自動テスト実行と結果アーティファクト化を行い、静的サイトのリグレッションを検知できる仕組みを導入。"
        },
        {
          title: "API 前提のデータ取得フロー",
          description:
            "本番は API 経由のみ許可し、ローカルではモック API を利用できる設計とすることで、現実の運用に近い開発体験を実現。"
        }
      ],
      architectureUrl: "/references/アーキテクチャ/portfolio-architecture.png"
    }
  },
  {
    id: 2,
    title: "AWSサーバーレス研修管理システム移行",
    summary: "オンプレミスの研修管理システムをAWSサーバーレス（API Gateway, Lambda, DynamoDB等）へ移行。Google認証連携やREST API化も担当。リーダーとして設計・構築・運用を主導。",
    techStack: [
      { name: "AWS API Gateway", icon: "/aws-icons/api-gateway_64.svg" },
      { name: "Lambda", icon: "/aws-icons/lambda_64.svg" },
      { name: "DynamoDB", icon: "/aws-icons/dynamodb_64.svg" },
      { name: "CloudFront", icon: "/aws-icons/cloudfront_64.svg" },
      { name: "S3", icon: "/aws-icons/s3_64.svg" },
      { name: "Cognito", icon: "/aws-icons/cognito_64.svg" },
      { name: "Node.js", icon: "" },
      { name: "Google Apps Script", icon: "" }
    ],
    detail: {
      type: "migration",
      pdf: "https://www.exa-corp.co.jp/technews/file/EVF2018_A-2.pdf",
      sections: [
        {
          heading: "プロジェクト背景・目的",
          body:
            "既存システムのサーバー老朽化、アプリケーションのサポート切れ、UIの使いにくさによる社員の活用不足。AWS上でサーバレスアプリケーションとしてシステムをリプレース。社員はチャットボット（iPhoneからも利用可能）で手軽に実績登録、育成担当はWebアプリで効率的に管理。"
        },
        {
          heading: "主要技術テーマ",
          list: [
            "AWS Lambda中心のサーバーレスアーキテクチャ",
            "チャットボットとWebアプリの二軸サービス",
            "CI/CD環境のフル自動化",
            "G Suite（Google OpenID Connect）認証"
          ]
        },
        {
          heading: "課題と解決策",
          list: [
            "ステートレスな環境での会話状態管理: Lambdaはイベント駆動型で会話状態を保持できない → DynamoDBに会話状態（user_id, intent_id, session）を格納・管理するロジックを独自実装",
            "レスポンス速度の根本的な問題解決: チャットボット応答が4秒と遅い → Lambdaのメモリ増強（128MB→512MB）で0.1秒まで短縮",
            "クラウド依存環境でのローカル開発: Lambda関数のテストが困難 → SAM LocalとDynamoDBローカルをDockerで組み合わせ、本番同等のローカル環境を構築"
          ]
        },
        {
          heading: "セキュリティ・自動化",
          list: [
            "認証・認可: Cognito+Google OpenID Connect連携でG Suite認証。AWSの複雑な認証基盤を実装し、セキュリティとユーザビリティを両立",
            "アクセス制御: WAF/CloudFront/API Gatewayによる多層的なアクセス制御。正当な権利者のみ利用可能な堅牢な防御策を設計・実装",
            "CI/CD: CodeCommit/CodePipeline/CodeBuild/CloudFormationのフルセット。Git-flowモデルとIaCで複数環境デプロイを自動化"
          ]
        },
        {
          heading: "成果・知見の還元",
          list: [
            "サーバーレスによる開発効率化と運用コスト削減",
            "チャットボットによる実績登録の簡略化",
            "ローカル開発環境の構築とナレッジ共有",
            "根本的な課題解決力・R&D能力・説明スキルを社内外で発揮"
          ],
          body: "本プロジェクトの内容を「AWS Lambdaを使った サーバレスのアプリケーション開発」として資料化し、社外フォーラムで発表。複雑な技術課題を体系的に整理し、他者に分かりやすく伝えるスキルも証明。"
        }
      ]
    }
    // --- ここまで詳細ページ用の拡張情報 ---
  },
  {
    id: 3,
    title: "クラウドネイティブなTODO管理システム開発ハンズオン設計・講師実績",
    summary: "AWSサーバーレスアーキテクチャを2時間で体得できるハンズオン研修を設計・講師として実施。S3/CloudFront/API Gateway/Lambda/DynamoDBを組み合わせた実践的なクラウドネイティブ開発を体系化し、延べ200名以上に登壇。",
    techStack: [
      { name: "AWS Lambda", icon: "/aws-icons/lambda_64.svg" },
      { name: "DynamoDB (NoSQL)", icon: "/aws-icons/dynamodb_64.svg" },
      { name: "API Gateway", icon: "/aws-icons/api-gateway_64.svg" },
      { name: "CloudFront (CDN/統合)", icon: "/aws-icons/cloudfront_64.svg" },
      { name: "S3", icon: "/aws-icons/s3_64.svg" },
      { name: "Node.js", icon: "" }
    ],
    detail: {
      type: "handson",
      pdf: "https://www.exa-corp.co.jp/technews/file/EVF2019_E-1.pdf",
      sections: [
        {
          heading: "プロジェクト要約（研修実績としての評価）",
          body: "クラウドネイティブなTODO管理システム開発ハンズオンの設計と講師実績。参加者にAWSサーバーレスアーキテクチャの基本構成を体系的に理解させ、「2時間で動く」アプリケーション開発を体験させることを目的とした。S3 / CloudFront（フロントエンド配信）、API Gateway / Lambda（API処理）、DynamoDB（データ永続化）を組み合わせたフルサーバーレス構成の構築手順を網羅。単なるサービス紹介に留まらず、各サービスの特性・制約・連携方法を実践を通じて分かりやすく伝える研修コンテンツとして高評価を獲得。"
        },
        {
          heading: "研修企画・実行の背景（組織還元力のアピール）",
          body: "「社内エンジニアのクラウドネイティブ開発への理解が遅れている」という課題を自ら設定し、その解決策として本研修を設計。自ら課題を設定し、解決策を導き、その知見を組織に還元するR&Dマインドと、講師としての企画力を強調。座学ではなく、2時間で実際に動くTODOアプリを完成させるという実践的な目標を設定。延べ200名以上への研修登壇実績。"
        },
        {
          heading: "アーキテクチャ解説と技術選定の意図（AWS専門性の証明）",
          image: "/images/handson-architecture.png",
          body: "S3をオリジンとするCloudFrontでシステムURLを統合し、静的コンテンツ配信とAPIルーティングを行うという、実践的な設計を提示。",
          list: [
            "DynamoDB: なぜRDBではなくNoSQL（DynamoDB）を選んだか。大規模データに強く、高速なレスポンスを実現する特性を研修で解説。",
            "Lambdaの制約: Lambdaの「インスタンスは使い捨て」「コールドスタート」などの注意点まで踏み込んで研修に含め、知識の深さと正確性をアピール。"
          ]
        },
        {
          heading: "複雑なトピックの分かりやすい解説（教育スキルの証明）",
          list: [
            "APIと静的コンテンツの統合: WebアプリとAPIが異なるドメインになることによるCORS（Cross-Origin Resource Sharing）の発生。この問題をCloudFrontによるURL統合、またはAPI GatewayでのCORS設定で解決。",
            "複雑な技術（CORSの仕組み、CloudFrontの役割）を体系的に分解し、解決策まで含めて分かりやすく伝えるスキルを証明。"
          ]
        },
        {
          heading: "成果と今後の展望",
          list: [
            "定量的成果: 参加者全員が時間内にアプリケーションを完成させた実績。",
            "組織へのインパクト: このコンテンツが社内のサーバーレス技術者育成の基盤となった。",
            "今後の展望: この知見を応用し、より複雑なAWS認証基盤やセキュリティ実装（WAFなど）を含む次期研修の開発に貢献したい。"
          ]
        }
      ]
    }
  },
  {
    id: 4,
    title: "AWSリソース棚卸・コスト最適化支援",
    summary: "数千リソースのAWS環境をTag Editor等で棚卸し、コスト最適化・タグ設計・運用改善を実施。フリーランスとして単独で担当。",
    techStack: [
      { name: "AWS Billing", icon: "/aws-icons/billing_64.svg" },
      { name: "Cost Explorer", icon: "/aws-icons/cost-explorer_64.svg" },
      { name: "Tag Editor", icon: "/aws-icons/tag-editor_64.svg" }
    ],
    detail: {
      type: "simple",
      sections: [
        {
          heading: "プロジェクト概要",
          body: "AWS環境のリソース棚卸し・コスト最適化・タグ設計・運用改善をフリーランスとして単独で担当。"
        },
        {
          heading: "主な技術・ツール",
          list: [
            "AWS Billing",
            "Cost Explorer",
            "Tag Editor"
          ]
        }
      ]
    }
  }
  // ...existing code...
];