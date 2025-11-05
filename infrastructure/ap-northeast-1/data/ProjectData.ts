// 型定義
export type ProjectTechStack = {
  name: string;
  icon: string;
};

export type ProjectSectionDetail = {
  heading: string;
  body: string;
};

export type ProjectSectionMore = {
  title: string;
  description: string;
};

export type ProjectSection = {
  heading?: string;
  title?: string; // 旧データ互換用（徐々にheadingへ移行）
  summary?: string;
  body?: string;
  list?: string[];
  details?: ProjectSectionDetail[];
  image?: string;
  imgURL?: string;
  more?: ProjectSectionMore[];
};

export type ProjectDetail = {
  type: string;
  pdf?: string;
  role?: string;
  sections: ProjectSection[];
};

export type Project = {
  id: number;
  title: string;
  summary: string;
  techStack: ProjectTechStack[];
  detail?: ProjectDetail;
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    title: "技術ポートフォリオ Web サイト構築",
    summary:
      "Next.js(App Router) + Chakra UI で実装した技術ポートフォリオ。Lambda/API Gateway/DynamoDB を用いたサーバレス API と連携し、CI/CD・IaC を含むエンドツーエンドの仕組みを整備。",
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
      sections: [
        {
          heading: "プロジェクト概要",
          body:
            "求職・案件獲得活動向けに、クラウドネイティブ技術力を提示するポートフォリオサイトを短期間で構築。サーバーレス構成とIaCで運用負荷を極小化し、生成AIを活用して学習・設計・実装サイクルを高速化。フロントエンド開発はAIに全面委任し、人はアーキテクチャ設計・セキュリティ・自動化の高度な判断に注力した。"
        },
        {
          heading: "役割と担当領域",
          summary:
            "サーバーレスと自動化を軸に、クラウド運用設計と品質担保をリード。フロントエンドはAIに任せ、自身は得意分野への投資に集中。",
          list: [
            "Next.js 15 App Router + Chakra UI による UI 設計・レビュー",
            "API Gateway + Lambda + DynamoDB によるプロジェクトデータ API 設計",
            "CodePipeline / CodeBuild / CloudFormation による CI/CD パイプライン構築",
            "Playwright による E2E テスト自動化とビルドパイプラインへの組み込み",
            "AI 共創のワークフロー設計とフロントエンド開発の全面的な委譲管理"
          ]
        },
        {
          heading: "クラウド設計と自動化",
          body:
            "限られた開発期間で設計・実装・運用までを一気通貫で進めるため、早期にアーキテクチャを固定し、CI/CD・テスト・監視をまとめて構築。リソース識別子はSSM Parameter Storeに自動登録し、他スタックとの連携も型安全に整備した。",
          list: [
            "Next.js(App Router) を output: export で静的書き出しし、CloudFront + S3 で配信",
            "API Gateway + Lambda + DynamoDB によるプロジェクトデータ API（VPC 内限定）",
            "CodePipeline/CodeBuild/CloudFormation による CI/CD 自動化と多段テスト",
            "Playwright による E2E テスト自動化と成果物アーティファクト化",
            "SSM Parameter Writer でデプロイ後の ARN や URL を自動登録"
          ]
        },
        {
          heading: "セキュリティ戦略",
          list: [
            "API Gateway を IAM 認証必須とし、利用者を限定したまま WAN 公開を実現",
            "CloudFront + AWS WAF で攻撃面を最小化し、静的配信と API 経路を統合",
            "DynamoDB へのアクセスは Lambda 経由に限定し、最小権限の IAM ロールで統制",
            "Infrastructure as Code でポリシー・ネットワーク制御を明示的に管理"
          ]
        },
        {
          heading: "AI 活用と分業設計",
          body:
            "要件整理やアーキテクチャ設計・セキュリティポリシー・CI/CD 整備といった判断領域は人間が担い、実装やドキュメント作成では GitHub Copilot を主体とした AI に委譲。特にフロントエンドは AI に全面委任し、レビューと最終調整のみ人が行うことで、高度な判断領域に時間を投下した。",
          list: [
            "UI 実装・テストコードのたたき台生成を AI に任せ、品質検証と最終調整を人間が担当",
            "バックエンドや IaC に関する変更は人間が設計判断を行い、AI は補助的にコード生成を実施",
            "AI との分業ルールを明文化し、レビュー観点と手戻りリスクを低減",
            "学習→AI 生成→レビュー→自動テストのループで改善スピードを最大化"
          ]
        },
        {
          heading: "システムアーキテクチャ図",
          image: "/img/portfolio-architecture.svg"
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
            "AI に任せる領域と人間が担う領域の境界を明確化し、短期間での成果最大化"
          ],
          body:
            "ポートフォリオ公開後は、CloudFront からの配信確認や CodePipeline での自動更新がスムーズに実行できるようになり、セキュアかつ自動化された運用基盤を維持しながら継続的な改善・機能追加を推進。",
          more: [
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
          ]
        }
      ]
    }
  },
  {
    id: 2,
    title: "AWSサーバーレス研修管理システム移行",
    summary:
      "オンプレミスの研修管理システムをAWSサーバーレス（API Gateway, Lambda, DynamoDB等）へ移行。Google認証連携やREST API化も担当。リーダーとして設計・構築・運用を主導。",
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
      role: "クラウドアーキテクト / テックリード",
      sections: [
        {
          heading: "プロジェクト背景・目的",
          body:
            "既存システムのサーバー老朽化、アプリケーションのサポート切れ、UI の使いにくさによる社員の活用不足を解消するため、AWS 上でサーバレスアプリケーションとしてシステムをリプレース。社員はチャットボットで手軽に実績登録、育成担当は Web アプリで効率的に管理できるよう再設計。"
        },
        {
          heading: "主要技術テーマ",
          list: [
            "AWS Lambda 中心のサーバーレスアーキテクチャ",
            "チャットボットと Web アプリの二軸サービス",
            "CI/CD 環境のフル自動化",
            "G Suite（Google OpenID Connect）認証"
          ]
        },
        {
          heading: "課題と解決策",
          list: [
            "ステートレスな環境での会話状態管理: Lambda はイベント駆動型で会話状態を保持できない → DynamoDB に会話状態（user_id, intent_id, session）を格納・管理するロジックを独自実装",
            "レスポンス速度の根本的な問題解決: チャットボット応答が 4 秒と遅い → Lambda のメモリ増強（128MB→512MB）で 0.1 秒まで短縮",
            "クラウド依存環境でのローカル開発: Lambda 関数のテストが困難 → SAM Local と DynamoDB ローカルを Docker で組み合わせ、本番同等のローカル環境を構築"
          ]
        },
        {
          heading: "セキュリティ・自動化",
          list: [
            "認証・認可: Cognito + Google OpenID Connect 連携で G Suite 認証を実現",
            "アクセス制御: WAF/CloudFront/API Gateway による多層的なアクセス制御で正当な権利者のみ利用可能に設計",
            "CI/CD: CodeCommit/CodePipeline/CodeBuild/CloudFormation のフルセットで複数環境デプロイを自動化"
          ]
        },
        {
          heading: "成果・知見の還元",
          list: [
            "サーバーレスによる開発効率化と運用コスト削減",
            "チャットボットによる実績登録の簡略化",
            "ローカル開発環境の構築とナレッジ共有",
            "根本的な課題解決力・R&D 能力・説明スキルを社内外で発揮"
          ],
          body:
            "本プロジェクトの内容を『AWS Lambda を使った サーバレスのアプリケーション開発』として資料化し、社外フォーラムで発表。複雑な技術課題を体系的に整理し、他者に分かりやすく伝えるスキルも証明。"
        }
      ]
    }
  },
  {
    id: 3,
    title: "クラウドネイティブなTODO管理システム開発ハンズオン設計・講師実績",
    summary:
      "AWSサーバーレスアーキテクチャを2時間で体得できるハンズオン研修を設計・講師として実施。S3/CloudFront/API Gateway/Lambda/DynamoDBを組み合わせた実践的なクラウドネイティブ開発を体系化し、延べ200名以上に登壇。",
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
      role: "研修設計 / 講師",
      sections: [
        {
          heading: "プロジェクト要約（研修実績としての評価）",
          body:
            "AWS サーバーレスアーキテクチャの基本構成を 2 時間で体得できるハンズオン研修を設計・登壇。S3 / CloudFront（フロント配信）、API Gateway / Lambda（API 処理）、DynamoDB（データ永続化）を組み合わせたフルサーバーレス構成を教材化し、延べ 200 名以上に提供。"
        },
        {
          heading: "研修企画・実行の背景（組織還元力のアピール）",
          body:
            "社内エンジニアのクラウドネイティブ開発理解が遅れている課題を自ら設定し、実践型研修として解決。課題設定からカリキュラム作成、講師登壇、ナレッジ共有までを一貫して担当。"
        },
        {
          heading: "アーキテクチャ解説と技術選定の意図（AWS 専門性の証明）",
          image: "/images/handson-architecture.png",
          list: [
            "DynamoDB: RDB ではなく NoSQL を採用し、スケーラビリティと高速レスポンスを確保",
            "Lambda の制約: 使い捨てインスタンスやコールドスタートなどの注意点まで踏み込み解説"
          ],
          body:
            "S3 をオリジンとする CloudFront でシステム URL を統合し、静的コンテンツ配信と API ルーティングを一本化する設計を提示。"
        },
        {
          heading: "複雑なトピックの分かりやすい解説（教育スキルの証明）",
          list: [
            "API と静的コンテンツの統合に伴う CORS 課題を CloudFront 統合や API Gateway 設定で解決",
            "CORS の仕組みや CloudFront の役割など複雑なテーマを分解し、ハンズオン形式で伝達"
          ]
        },
        {
          heading: "成果と今後の展望",
          list: [
            "定量的成果: 参加者全員が時間内にアプリケーションを完成",
            "組織へのインパクト: サーバーレス技術者育成の基盤コンテンツとして定着",
            "今後の展望: 認証基盤やセキュリティ実装を含む次期研修への発展"
          ]
        }
      ]
    }
  },
  {
    id: 4,
    title: "AWSリソース棚卸・コスト最適化支援",
    summary:
      "数千リソースのAWS環境をTag Editor等で棚卸し、コスト最適化・タグ設計・運用改善を実施。フリーランスとして単独で担当。",
    techStack: [
      { name: "AWS Billing", icon: "/aws-icons/billing_64.svg" },
      { name: "Cost Explorer", icon: "/aws-icons/cost-explorer_64.svg" },
      { name: "Tag Editor", icon: "/aws-icons/tag-editor_64.svg" }
    ],
    detail: {
      type: "simple",
      role: "クラウドコストアナリスト",
      sections: [
        {
          heading: "プロジェクト概要",
          body:
            "数千規模の AWS リソースを棚卸し、コスト最適化・タグ設計・運用改善を短期間で実施。現状分析から改善計画立案、定着化支援までをフリーランスとして単独で担当。"
        },
        {
          heading: "主な施策",
          list: [
            "Tag Editor を用いたタグの統一・命名規約整備",
            "Cost Explorer によるコスト異常検知と削減プランの策定",
            "請求ダッシュボードの再設計と運用プロセス定義"
          ]
        }
      ]
    }
  }
];

export default PROJECTS_DATA;