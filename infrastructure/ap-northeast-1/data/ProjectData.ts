// 型定義
export type ProjectTechStack = {
  name: string;
  icon: string;
};

export type ProjectSectionDetail = {
  heading: string;
  body: string;
};

export type ProjectSectionCard = {
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
  good?: ProjectSectionCard[];
  more?: ProjectSectionCard[];
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
  git?: string;
  techStack: ProjectTechStack[];
  detail?: ProjectDetail;
  cardSize?: "regular" | "compact";
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    title: "技術ポートフォリオ Web サイト構築",
    summary:
      "自身のAWSに関する知見や技術を表現するためのポートフォリオ。\nサーバーレスと自動化を最大のテーマとし、それを実現するための技術スタックを採用。\n短期間でより良いものを実現するために、AIを活用して設計・実装を高速化。",
    git: "https://github.com/GitShou/portfolio",
    techStack: [
      { name: "AWS CloudFormation", icon: "/aws-icons/cloudformation_64.svg" },
      { name: "AWS CodePipeline", icon: "/aws-icons/codepipeline_64.svg" },
      { name: "Route 53", icon:"/aws-icons/Route-53_64.svg"},
      { name: "Amazon CloudFront", icon: "/aws-icons/cloudfront_64.svg" },
      { name: "AWS WAF", icon: "/aws-icons/waf_64.svg" },
      { name: "AWS Lambda@Edge", icon: "/aws-icons/lambda_64.svg" },
      { name: "AWS API Gateway", icon: "/aws-icons/api-gateway_64.svg" },
      { name: "AWS Lambda", icon: "/aws-icons/lambda_64.svg" },
      { name: "Amazon DynamoDB", icon: "/aws-icons/dynamodb_64.svg" },
      { name: "Amazon S3", icon: "/aws-icons/s3_64.svg" },
      { name: "AWS Systems Manager Parameter Store", icon: "/aws-icons/systems-manager_64.svg" },
      { name: "AWS CodeBuild", icon: "/aws-icons/codebuild_64.svg" },
      { name: "AWS IAM", icon: "/aws-icons/identity-and-access-management_64.svg" },
      { name: "AWS Glue", icon: "/aws-icons/glue_64.svg" },
      { name: "Amazon Athena", icon: "/aws-icons/athena_64.svg" },
      { name: "Next.js", icon: "" },
      { name: "TypeScript", icon: "" },
      { name: "Chakra UI", icon: "" }
    ],
    cardSize: "regular",
    detail: {
      type: "portfolio",
      role: "フルスタックエンジニア / アーキテクト / クラウドネイティブ開発者",
      sections: [
        {
          heading: "システムアーキテクチャ図",
          image: "/img/portfolio-architecture.svg"
        },
        {
          heading: "クラウドネイティブな設計と自動化",
          body:
            "自身が持つAWSの知識/技術を最大限表現するためにサーバーレスとIaCの徹底と自動化にこだわり抜いた。\nCFNでデプロイされるリソースはそのすべてが自動的に更新されるように設計されており、手動での介入を一切排除している。",
          good: [
            {
              title: "サーバーレスアーキテクチャの徹底",
              description:
                "AWSのサーバーレスサービスをフル活用することで、インフラ管理の手間を大幅に削減。全面的なコード化も可能となり、迅速な展開と変更が実現できた。\nTemplateもSAMを用いて記述し、可読性を高めた。"
            },
            {
              title: "テンプレート駆動開発の徹底",
              description:
                "パイプライン以外の各AWSリソースを手動で設定、修正は一切行わず、すべてCloudFormationテンプレートで管理。\nこれにより、環境の再現性が向上し、変更履歴の追跡も容易となった。"
            },
            {
              title: "Lambda@Edgeを活用した柔軟なURL設計",
              description:
                "Lambda@Edgeを使用して、CloudFrontのリクエストを動的に書き換える仕組みを導入。\nこれにより、静的サイトでありながら柔軟なURL設計が可能となり、SEOやユーザビリティの向上に寄与した。"
            },
            {
              title: "SSM Parameter Store への自動登録",
              description:
                "各リソースが依存するARNやURLをデプロイ後に自動登録する仕組みを導入。\nこれにより、手動での設定ミスを防ぎ、迅速で柔軟な環境構築と更新が可能となった。"
            },
            {
              title: "CloudFrontログをGlue/Athenaで可視化基盤化",
              description:
                "CloudFrontのアクセスログをS3へ自動出力し、Glue Data CatalogとAthenaを組み合わせてパーティション化・Parquet化。\n低コストでクエリ・可視化できる分析基盤をテンプレート化し、運用の属人化を排除した。"
            },
            {
              title: "レイヤーごとにスタックを分離",
              description:
                "フロントエンド、バックエンドを独立したスタックとして管理。\nこれにより、各レイヤーの変更が他に影響を与えず、開発とデプロイの柔軟性が向上した。"
            },
            {
              title: "アメリカリージョンとの連携",
              description:
                "CloudFrontに適用するWAFのデプロイはアメリカリージョン限定であったため、リージョンを跨いだ自動化を実現した。"
            },
            {
              title: "コンテンツを容易に改善できるように設計",
              description:
                "フロントエンドはAIに一任しているが、コンテンツの中身を自身で容易に変更できるようにデータとして分離してDynamoDBへ保存し、フロントエンドはそのデータをもとにビルドすることで、柔軟な改善を可能にしている。"
            }
          ],
          more: [
            {
              title: "パイプラインのIaC化",
              description:
                "現状は一連のパイプラインはUI上で手動設定しているが、パイプラインも完全にコード化することで、より全体の管理が容易となる。"
            },
            {
              title: "プロジェクトデータの編集を認証付きWebページで編集可能にする",
              description:
                "Cognitoを使用して認証機能を導入し、プロジェクトデータを簡単に修正できるようにする。"
            },
            {
              title:"DBの変更によるコンテンツの再ビルドを実装する",
              description:
                "Webページによって、DBのデータを修正できるようになる際には、コンテンツのビルドのみ自動的に再実行されることで、不要な全体デプロイを避ける。"
            },
            {
              title:"テストの拡充",
              description:"現在はテストフェーズをパイプライン上に用意することを優先していたため、バックエンド、フロントエンド双方のテストケースが最低限に留まっている。\nより充実させることで、品質担保と継続的改善が必要。"
            },
            {
              title: "システムの監視機構の強化",
              description:"CloudWatch Canaryなどによるフロントエンドの監視や、Lambda等を使ったインテグレーションテストによるバックエンドの強化が必要。"
            },
            {
              title:"バリデーション機構の強化",
              description:"プロジェクトのデータを編集する際に、データの整合性を保つための適切なバリデーション機構が必要。\nデータの柔軟さと整合性を両立させるための工夫が求められる。"
            }
          ]
        },
        {
          heading: "AI活用による高速かつ高品質な開発",
          summary:
            "自身の専門領域であるインフラ部分はAIを高度なアドバイザーとして活用し、自身の設計思想を基にAIと対話の上で設計と実装を最適化。\nフロントエンドは開発速度優先でAIへ全面的に委任することで、高品質と速度を両立させた。",
          good: [
            {
              title: "AIとの分業による高速開発を実現",
              description:"システムの構成を振り返り、仮にこれを一人で開発した場合、時間は数倍かかり、品質も陳腐なものになっていたと感じる。\n課題を感じた部分もあったが、総合的に見てAIを最大限活用したことは大きな成功であったと考えている。"
            },
            {
              title: "AI(Gpt-5 Codex)の特性を少し理解した",
              description:"今回使用したモデルはGpt-5 Codexだったが、このモデルの場合はシステムの改善の際に構造の見直しをすることはほとんどなく、既存の構造を踏襲したうえで目的を実現しようとする。\nAIの実装速度を考えるともったいないので、人間が適切に指示を出したり、全体の構造設計を担うことが重要であると感じた。"
            },
            {
              title: "特性に合ったAIを組み合わせる",
              description: "今回のプロジェクトではGpt-5 CodexをメインのAIとして採用したが、AWSの仕様となる部分や細かいレベルになるとハレーションもそれなりに発生した。\nそのため、Amazon Qを導入し、より専門的な知識を持つAIを組み合わせることで、問題解決が行いやすくなった。"
            },
            {
              title: "AIを知識豊富な技術者として捉える。",
              description:
                "基本的には正しい回答が返ってくるが、まれに大きな矛盾や見落としがあるため、あくまで人と対話をするように利用した。\n今回の開発を通して、AIの特性を理解し、適切に活用するスキルが向上した。"
            },
            {
              title: "ソースコードは基本的にAIに書いてもらい、レビューと調整を自身が担当。",
              description:
                "今回の開発でソースコードはAIに作成させたほうが高速かつ高品質であると感じた。\n人間はシステムの全体像とそのプロセスを正確に設計/把握し、その実装をAIに任せる役割分担が効果的であると実感した。"
            },
            {
              title: "AIに全面的に委任することも可能",
              description:
                "本システムではフロントエンドは全面的にAIにより作成されている。\nミニマムな開発体制の場合は、レイヤー単位でAIに全面委任することも有効であると感じた。"
            },
            {
              title: "学習コストの大幅な削減",
              description:
                "開発を行うにあたりブランクがあったため、既存の知識の復習や新しい技術の習得が必要となる場面が多かったが、AIを活用することで必要な情報を迅速に取得でき、学習コストを大幅に削減できた。"
            }
          ],
          more: [
            {
              title: "AIの提案や実装等への対応力の向上",
              description:"開発を進める中で、AIの矛盾や無駄な設計/実装を見抜くことはあったが、基本的には知識も実装力も豊富であるAIに指摘できていない箇所も多いと思われるので、自身のスキルアップと全体を正確に把握する力がさらに必要"
            },
            {
              title:"AIへの指示の最適化",
              description:"AIへの指示が曖昧だったり、自身とAIとの知識力の差によって適切な指示ができていない場合もあった。\nそれによる手戻り等も発生したので、より的確な指示ができるように自身のスキルアップが必要である。"
            }
          ]
        },
        {
          heading: "セキュリティ戦略",
          body: "本プロジェクトではWANとAWSローカルの境界部分のセキュリティを強く意識することとした。",
          good: [
            {
              title: "WANへ向いているリソースを最適化",
              description: "本システムではCloudfrontとAPI GatewayのみがWANへ向いている。序盤の設計ではAPIもVPC内にデプロイし最小限とするつもりであったが、AIと対話をする中で今後の拡張性なども考慮し、WAN向けに配置する設計へと変更した。"
            },
            {
              title: "セキュリティ対策",
              description: "コンテンツの配信はCloudFront経由とし、WAFを適用することで攻撃面を最小化。また、API GatewayはIAM認証を適用し、正当なクライアントからの呼び出しのみを許可する設計とした。"
            }
          ],
          more: [
            {
              title: "認証機構の導入",
              description:"より柔軟にコンテンツを改善させるためには管理者ページが必要となるため、cognitoを使用して認証機能を導入する必要がある。"
            },
            {
              title:"より正確な認証システムの理解",
              description:"現状のIAM認証などはAIによる実装のため、そのロジックや処理のプロセスの実態を把握できていないため、これらの理解を深める必要がある。"
            },
            {
              title:"WAFルールの最適化",
              description:"現在はAIに任せた実装になってしまっているので、自分で理解して設定する必要がある。"
            }
          ]
        },
        {
          heading: "その他",
          details: [
            {
              heading: "開発期間と工数", 
              body: "平日1日平均3時間で開発を進め、トータル100時間程度で本システムをフルスタックで完成させた。\n空白の時間を見つけ、今後もMore部分の改善を続ける予定。"
            },
            {
              heading:"成果・学び",
              body: "改めて、開発の楽しさを実感できた。\nフロント/バック/CI/CD を横断したフルスタックな設計力の可視化。\nNext.js 15 の最新仕様 (app, static export, eslint 連携) へのキャッチアップ。\nCI 上でのブラウザ自動テスト導入による品質担保体制の整備。\nIaC を通じた再現性の高いクラウド環境構築。\nAI に任せる領域と人間が担う領域の境界を明確化し、短期間での成果最大化。"
            }
          ]
        }
      ]
    }
  },
  {
    id: 2,
    title: "AWSへの研修管理システムのマイグレーション",
    summary:
      "オンプレミスの研修管理システムをAWSへ移行。\nその際に維持管理を容易にするため、フルマネージド構成になるように設計。\nGoogle認証連携やREST API化も担当。リーダーとして設計・構築・運用を主導。",
    techStack: [
      { name: "Cognito", icon: "/aws-icons/cognito_64.svg" },
      { name: "AWS API Gateway", icon: "/aws-icons/api-gateway_64.svg" },
      { name: "Lambda", icon: "/aws-icons/lambda_64.svg" },
      { name: "DynamoDB", icon: "/aws-icons/dynamodb_64.svg" },
      { name: "CloudFront", icon: "/aws-icons/cloudfront_64.svg" },
      { name: "S3", icon: "/aws-icons/s3_64.svg" },
      { name: "Node.js", icon: "" },
      { name: "Google Apps Script", icon: "" }
    ],
    cardSize: "regular",
    detail: {
      type: "migration",
      pdf: "https://www.exa-corp.co.jp/technews/file/EVF2018_A-2.pdf",
      role: "クラウドアーキテクト / テックリード",
      sections: [
        {
          heading: "プロジェクト目的",
          body:
            "既存システムのサーバー老朽化、アプリケーションのサポート切れ、UI の使いにくさによる社員の活用不足を解消するため、AWS 上でサーバレスアプリケーションとしてシステムをリプレース。社員はチャットボットで手軽に実績登録、育成担当は Web アプリで効率的に管理できるよう再設計。"
        },
        {
          heading: "組織的な背景",
          body:
            "この時に所属していた部署は技術研究を主なミッションとしており、最新技術の調査・検証・導入を通じて社内の技術力向上を目指していた。元システムの老朽化と、我々のミッションに合致したことから、クラウドネイティブなサーバレスアーキテクチャへの刷新を提案・実施。"
        },
        {
          heading: "主要技術テーマ",
          good: [
            {
              title: "AWS Lambda 中心のサーバーレスアーキテクチャ",
              description:
                "イベント駆動を軸に API Gateway と連携させ、スケーラブルかつ運用負荷の低いアプリケーション基盤を構築。"
            },
            {
              title: "チャットボットと Web アプリの二軸サービス",
              description:
                "利用者向けチャットボットと管理者向け Web UI を統合運用し、ユースケースに応じた体験を実現。"
            },
            {
              title: "CI/CD 環境のフル自動化",
              description:
                "CodePipeline と CodeBuild を中心に、テストからデプロイまでを一貫自動化して品質と速度の両立を図った。"
            },
            {
              title: "G Suite（Google OpenID Connect）認証",
              description:
                "既存の Google アカウントと連携したシングルサインオンを提供し、導入コストを抑えつつ UX を向上。"
            }
          ]
        },
        {
          heading: "課題と解決策",
          good: [
            {
              title:
                "ステートレスな環境での会話状態管理",
              description:
                "DynamoDB に会話ステータスを保持する設計を導入し、Lambda の都度起動でも対話の連続性を維持できるようにした。"
            },
            {
              title: "クラウド依存環境でのローカル開発",
              description:
                "SAM Local と DynamoDB Local を Docker で統合し、ローカルでも本番同等の検証が行える開発体制を整備。"
            }
          ]
        },
        {
          heading: "セキュリティ・自動化",
          good: [
            {
              title: "認証・認可: Cognito + Google OpenID Connect",
              description:
                "社内の Google アカウントと連携し、権限管理を Cognito で統合することで安全なサインイン体験を提供。"
            },
            {
              title: "アクセス制御: 多層防御の実装",
              description:
                "CloudFront と WAF、API Gateway を段階的に配置し、不正アクセスを複数レイヤーでブロックする構成を採用。"
            },
            {
              title: "CI/CD: フルマネージドサービスで自動化",
              description:
                "CodeCommit から CloudFormation までをパイプライン化し、複数環境へのデプロイをボタン一つで再現可能にした。"
            }
          ]
        },
        {
          heading: "成果・知見の還元",
          good: [
            {
              title: "サーバーレスによる開発効率化と運用コスト削減",
              description:
                "運用対象を最小限に抑えたことで改善サイクルが高速化し、ピーク時以外のコストも大幅に圧縮できた。"
            },
            {
              title: "チャットボットによる実績登録の簡略化",
              description:
                "従来の入力フォームに比べ利用率が向上し、現場の実績収集がリアルタイムで可能になった。"
            },
            {
              title: "ローカル開発環境の構築とナレッジ共有",
              description:
                "構築手順とノウハウを社内へ展開し、後続チームも同じテンプレートで素早く検証できる状態を作った。"
            },
            {
              title: "根本的な課題解決力・R&D 能力・説明スキルを社内外で発揮",
              description:
                "技術的課題の抽象化と再定義を行い、フォーラム発表を通じて組織外にも知見を公開した。"
            }
          ],
          body:
            "本プロジェクトの内容を『AWS Lambda を使った サーバレスのアプリケーション開発』として資料化し、社外フォーラムで発表。複雑な技術課題を体系的に整理し、他者に分かりやすく伝えるスキルも証明。"
        }
      ]
    }
  },
  {
    id: 3,
    title: "クラウドネイティブ開発ハンズオン設計・講師実績",
    summary:
      "研修管理システムのマイグレーションプロジェクトで得た知見を土台に、クラウドネイティブなアプリ開発を体験できるハンズオン研修を設計・講師として延べ150名以上に実施。",
    techStack: [
      { name: "AWS Lambda", icon: "/aws-icons/lambda_64.svg" },
      { name: "DynamoDB (NoSQL)", icon: "/aws-icons/dynamodb_64.svg" },
      { name: "API Gateway", icon: "/aws-icons/api-gateway_64.svg" },
      { name: "CloudFront (CDN/統合)", icon: "/aws-icons/cloudfront_64.svg" },
      { name: "S3", icon: "/aws-icons/s3_64.svg" },
      { name: "Node.js", icon: "" }
    ],
    cardSize: "compact",
    detail: {
      type: "handson",
      pdf: "https://www.exa-corp.co.jp/technews/file/EVF2019_E-1.pdf",
      role: "研修設計 / 講師",
      sections: [
        {
          heading: "フルスペック版とイベント向け軽量版の2種類を作成",
          body:
            "社内エンジニア向けの7時間で完結するフルスペック版と、社外のエンジニアも含むイベント向け2時間の軽量版の2種類を作成。\n本Webページに記載しているPDFはイベント用の軽量版。"
        },
        {
          heading: "研修企画・実行の背景",
          body:
            "社内エンジニアのクラウドネイティブ開発理解が遅れている課題を自ら設定し、実践型研修として解決。課題設定からカリキュラム作成、講師登壇、ナレッジ共有までを一貫して担当。"
        },
        {
          heading: "未知を既知に変える実践的カリキュラム設計",
          good: [
            {
              title: "全体のアーキテクチャと各ステップの関連性を図解してわかりやすく提示",
              description:
                "研修冒頭で全体像を示し、各ステップがどのように連携しているかを視覚的に理解できるよう工夫。\n研修時間内でも"
            },
            {
              title: "手順の定着は後でできるように、スクリーンショットを豊富に用意",
              description:
                "研修の時間内では細かな手順等を覚えることは不可能なので詳細の説明は最低限に抑え、研修後に復習できるように豊富なスクリーンショットを提供。"
            }
          ],
        },
        {
          heading: "付録を充実させ、プロジェクトで得た知見を最大限共有",
          good: [
            {
              title: "API と静的コンテンツ統合時の CORS 対応",
              description:
                "CloudFront ビヘイビアと API Gateway の設定例を提供し、実際に手を動かしながら CORS をクリアする流れを学べる教材にした。"
            },
            {
              title: "CORS と CloudFront の役割を分解して解説",
              description:
                "ネットワーク層ごとの責務を図解し、受講者が混乱しやすいポイントをステップごとに理解できるよう工夫。"
            }
          ]
        },
      ]
    }
  },
];

export default PROJECTS_DATA;
