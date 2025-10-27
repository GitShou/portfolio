# DynamoDB プロジェクトテーブル設計

`infrastructure/ap-northeast-1/templates/Portfolio.yml` で定義しているポートフォリオ用 DynamoDB テーブルの構造をまとめます。

## 概要

- **テーブル名**: `${ProjectName}-projects`
- **課金モード**: `PAY_PER_REQUEST`
- **用途**: Web 画面で公開するプロジェクト情報を永続化する。
- **主なアクセスパターン**:
  - 公開プロジェクトを表示順に取得する。
  - `id` を指定して個別プロジェクトを取得する。
  - プロジェクト種別（例: migration, handson）でフィルタする。

## 主キー構造

| 属性名 | 旧名称 | 型 | 役割 |
| --- | --- | --- | --- |
| `EntityPartitionKey` | `PK` | 文字列 | 同一エンティティ（プロジェクト）の項目をまとめる。形式は `PROJECT#<id>`。 |
| `EntitySortKey` | `SK` | 文字列 | 同じプロジェクト内で項目種別を切り分ける。メイン情報は `PROFILE` を使用。 |

### 例

```
PK = "PROJECT#1"
SK = "PROFILE"
```

## グローバルセカンダリインデックス

### GSI1: ポートフォリオ一覧用

公開中のプロジェクトを表示順に取得するためのインデックス。

| 属性 | 型 | 例 |
| --- | --- | --- |
| `PortfolioIndexPartitionKey` (`GSI1PK`) | 文字列 | `PORTFOLIO#ALL` |
| `PortfolioIndexSortKey` (`GSI1SK`) | 文字列 | `ORDER#0001` |

- `PortfolioIndexPartitionKey = "PORTFOLIO#ALL"` でクエリし、`PortfolioIndexSortKey` でソート順を制御する。

### GSI2: プロジェクト種別検索用

プロジェクト種別ごとの絞り込みに使用するインデックス。

| 属性 | 型 | 例 |
| --- | --- | --- |
| `ProjectTypeIndexPartitionKey` (`GSI2PK`) | 文字列 | `TYPE#migration` |
| `ProjectTypeIndexSortKey` (`GSI2SK`) | 文字列 | `ORDER#0001` |

- `ProjectTypeIndexPartitionKey = "TYPE#migration"` でクエリし、対象種別のみ取得する。

## アイテム構造

`SK = "PROFILE"` に格納するメインアイテムは、フロントエンド (`src/lib/data.ts`) が期待する構造と一致させる。例:

```json
{
  "EntityPartitionKey": "PROJECT#1",
  "EntitySortKey": "PROFILE",
  "PortfolioIndexPartitionKey": "PORTFOLIO#ALL",
  "PortfolioIndexSortKey": "ORDER#0001",
  "ProjectTypeIndexPartitionKey": "TYPE#migration",
  "ProjectTypeIndexSortKey": "ORDER#0001",
  "id": 1,
  "title": "AWSサーバーレス研修管理システム移行",
  "summary": "...",
  "type": "migration",
  "pdf": "https://...",
  "architectureUrl": "https://...",
  "techStack": [
    { "name": "AWS API Gateway", "icon": "/aws-icons/api-gateway_64.svg" },
    { "name": "Lambda", "icon": "/aws-icons/lambda_64.svg" }
  ],
  "sections": [
    { "heading": "プロジェクト背景・目的", "body": "..." },
    { "heading": "主要技術テーマ", "list": ["AWS Lambda中心の..."] }
  ],
  "metadata": {
    "status": "PUBLISHED",
    "order": 1,
    "updatedAt": "2025-10-24T00:00:00Z"
  }
}
```

### サブアイテムの例

- 多言語や履歴などを追加する場合は、同じ `EntityPartitionKey` に `EntitySortKey = "LOCALE#ja-JP"` や `HISTORY#<timestamp>` を追加して管理する。

## データ投入の指針

- `EntityPartitionKey` と `EntitySortKey` はプロジェクトの `id` から組み立てる。
- ポートフォリオ一覧や種別検索に載せたい項目のみ、GSI 用属性を設定する。
- 表示順を制御したい場合、`PortfolioIndexSortKey` にはゼロ詰めした順序文字列（`ORDER#0001` など）を入れてソート可能にする。
- `ProjectTypeIndexSortKey` も表示順や更新日時など、種別内で整列したい値を設定する。

## Lambda からの利用方法

- `GET /projects`: `PortfolioIndexPartitionKey = "PORTFOLIO#ALL"` で GSI1 をクエリし、表示順に取得する。
- `GET /projects/{id}`: `EntityPartitionKey = PROJECT#<id>`、`EntitySortKey = PROFILE` で `GetItem` を実行する。
- 将来的なフィルタ: `ProjectTypeIndexPartitionKey` に種別を指定して GSI2 をクエリする。

## 補足

- テーブル定義は `Portfolio.yml` の `ProjectTable` リソースで管理する。
- AWS SDK v3 の `marshall` / `unmarshall` ヘルパーと併用可能。
- 属性名は Lambda やシードスクリプトから参照されるため、変更時は影響範囲を確認すること。
