# AWS services used in this project
$services = @(
  "route-53",
  "cloudfront",
  "waf",
  "api-gateway",
  "lambda",
  "dynamodb",
  "s3",
  "codepipeline",
  "codebuild",
  "cloudformation",
  "cognito",
  "systems-manager",
  "identity-and-access-management"
)

$srcRoot = "references/aws-icons"
$dstRoot = "frontend/public/aws-icons"

foreach ($service in $services) {
  Get-ChildItem -Path $srcRoot -Recurse -Include "*$service*_64.svg" -File | ForEach-Object {
    $newName = "$service`_64.svg"
    $dstPath = Join-Path $dstRoot $newName
    Write-Host "Copying $($_.FullName) to $dstPath"
    Copy-Item $_.FullName -Destination $dstPath -Force
  }
}
