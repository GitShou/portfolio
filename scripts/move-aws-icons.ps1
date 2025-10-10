# サービス名リスト（部分一致用）
$services = @(
  "api-gateway",
  "lambda",
  "dynamodb",
  "cloudfront",
  "s3",
  "cognito",
  "cloudformation",
  "codecommit",
  "codebuild",
  "billing",
  "cost-explorer",
  "tag-editor",
  "athena",
  "glue",
  "cloudwatch"
)

$srcRoot = "references/aws-icons"
$dstRoot = "public/aws-icons"

foreach ($service in $services) {
  # サービス名が部分一致し、ファイル名が_64.svgで終わるものを検索
  Get-ChildItem -Path $srcRoot -Recurse -Include *$service*_64.svg -File | ForEach-Object {
    # ファイル名から不要な部分を除去して「サービス名_64.svg」だけにする
    $newName = "$service`_64.svg"
    $dstPath = Join-Path $dstRoot $newName
    Write-Host "Copying $($_.FullName) to $dstPath"
    Copy-Item $_.FullName -Destination $dstPath -Force
  }
}
