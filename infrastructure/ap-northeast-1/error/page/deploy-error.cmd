@echo off
setlocal EnableExtensions EnableDelayedExpansion

pushd "%~dp0"

set "STACK_NAME=error-page-stack"
set "AWS_REGION=ap-northeast-1"
set "AWS_PROFILE=default"

set "TEMPLATE_FILE=%~dp0error-template.yml"
set "ERROR_HTML=%~dp0error.html"
set "BUCKET_NAME=portfolio5352-error-pages"


echo [INFO] Deploying CloudFormation stack "%STACK_NAME%"...
aws cloudformation deploy ^
  --stack-name "%STACK_NAME%" ^
  --template-file "%TEMPLATE_FILE%" ^
  --region %AWS_REGION% ^
  --profile %AWS_PROFILE% ^
  --no-fail-on-empty-changeset
if errorlevel 1 goto :error

echo [INFO] Resolving target bucket from stack output "ErrorPageBucketName"...
for /f "usebackq delims=" %%B in (`aws cloudformation describe-stacks --stack-name "%STACK_NAME%" --query "Stacks[0].Outputs[?OutputKey=='ErrorPageBucketName'].OutputValue" --output text --region %AWS_REGION% --profile %AWS_PROFILE%`) do (
  set "BUCKET_NAME=%%B"
)

if not defined BUCKET_NAME goto :bucket_error
if /i "!BUCKET_NAME!"=="None" goto :bucket_error

echo [INFO] Uploading "%ERROR_HTML%" to "s3://!BUCKET_NAME!/error.html" ...
aws s3 cp "%ERROR_HTML%" "s3://!BUCKET_NAME!/error.html" --content-type "text/html" --region %AWS_REGION% --profile %AWS_PROFILE%
if errorlevel 1 goto :error

echo [INFO] Done. Bucket: !BUCKET_NAME!
popd
exit /b 0

:bucket_error
echo [ERROR] Could not resolve stack output "ErrorPageBucketName". 1>&2
echo [ERROR] Please confirm stack "%STACK_NAME%" exists and finished successfully. 1>&2
popd
exit /b 2

:error
echo [ERROR] Command failed. 1>&2
popd
exit /b 1
