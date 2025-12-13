@echo off
setlocal EnableExtensions EnableDelayedExpansion

pushd "%~dp0"

set "STACK_NAME=error-failover-stack"
set "AWS_REGION=ap-northeast-1"
set "AWS_PROFILE=default"

set "TEMPLATE_FILE=%~dp0failover-template.yml"

echo [INFO] Deploying CloudFormation stack "%STACK_NAME%"...
aws cloudformation deploy ^
  --stack-name "%STACK_NAME%" ^
  --template-file "%TEMPLATE_FILE%" ^
  --region %AWS_REGION% ^
  --profile %AWS_PROFILE% ^
  --no-fail-on-empty-changeset
if errorlevel 1 goto :error

echo [INFO] Done.
popd
exit /b 0

:error
echo [ERROR] Command failed. 1>&2
popd
exit /b 1

