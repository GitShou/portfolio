#!/bin/bash
set -e

STACK_NAME="CloudFrontWafStack"
OUTPUT_KEY="WebAclArn"
PARAM_NAME="/portfolio/waf/arn"
REGION="us-east-1"

# CloudFormationスタックのOutputsからWAF ARNを取得
WAF_ARN=$(aws cloudformation describe-stacks \
  --region "$REGION" \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='$OUTPUT_KEY'].OutputValue" \
  --output text)

if [ -z "$WAF_ARN" ]; then
  echo "WAF ARNが取得できませんでした。" >&2
  exit 1
fi

# SSM Parameter Storeに格納（overwrite有効）
aws ssm put-parameter \
  --region "$REGION" \
  --name "$PARAM_NAME" \
  --type String \
  --value "$WAF_ARN" \
  --overwrite

echo "WAF ARNをSSM Parameter Storeに格納しました: $WAF_ARN"
