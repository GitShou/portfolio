import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { CloudFormationClient, DescribeStackResourceCommand } from "@aws-sdk/client-cloudformation";

const TARGET_FUNCTION_ARN = process.env.PARAMETER_WRITER_FUNCTION_ARN;

if (!TARGET_FUNCTION_ARN) {
  throw new Error("PARAMETER_WRITER_FUNCTION_ARN environment variable is required.");
}

const lambdaClient = new LambdaClient({});
const cloudFormationClient = new CloudFormationClient({});

const textDecoder = new TextDecoder("utf-8");

async function invokeParameterWriter(payload) {
  const response = await lambdaClient.send(
    new InvokeCommand({
      FunctionName: TARGET_FUNCTION_ARN,
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify(payload), "utf8"),
    })
  );

  if (!response.Payload) {
    return {};
  }

  try {
    const text = textDecoder.decode(response.Payload);
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.warn("Failed to parse response payload", error);
    return {};
  }
}

const sleep = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

async function describeStackResourceWithRetry(stackId, logicalResourceId, retries = 5, delayMs = 3000) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const result = await cloudFormationClient.send(
        new DescribeStackResourceCommand({
          StackName: stackId,
          LogicalResourceId: logicalResourceId,
        })
      );

      const physicalResourceId = result.StackResourceDetail?.PhysicalResourceId;
      if (physicalResourceId) {
        return physicalResourceId;
      }
    } catch (error) {
      lastError = error;
    }

    await sleep(delayMs);
  }

  throw lastError ?? new Error(`Failed to resolve physical resource ID for ${logicalResourceId}.`);
}

async function resolveParameterValue(spec, event) {
  if (spec.value !== undefined) {
    return spec.value;
  }

  if (spec.Value !== undefined) {
    return spec.Value;
  }

  const valueFrom = spec.valueFrom ?? spec.ValueFrom;

  if (!valueFrom) {
    return undefined;
  }

  const type = valueFrom.type ?? valueFrom.Type;

  switch (type) {
    case "apiGatewayBaseUrl": {
      const logicalId = valueFrom.logicalId ?? valueFrom.LogicalId;
      const stage = valueFrom.stage ?? valueFrom.Stage;
      const region = valueFrom.region ?? valueFrom.Region ?? process.env.AWS_REGION;

      if (!logicalId) {
        throw new Error("valueFrom.apiGatewayBaseUrl requires a logicalId.");
      }

      const stackId = event.StackId;
      const restApiId = await describeStackResourceWithRetry(stackId, logicalId);

      if (!region) {
        throw new Error("AWS region is required to resolve apiGatewayBaseUrl.");
      }

      const stageSuffix = stage ? `/${stage}` : "";
      return `https://${restApiId}.execute-api.${region}.amazonaws.com${stageSuffix}`;
    }
    default:
      throw new Error(`Unsupported valueFrom.type: ${type}`);
  }
}

async function normalizeParameterSpec(spec, action, event) {
  if (!spec) {
    return null;
  }

  const name = spec.name ?? spec.Name;
  const type = spec.type ?? spec.Type;
  const overwrite = spec.overwrite ?? spec.Overwrite;

  if (!name) {
    throw new Error("Each parameter entry must include a name.");
  }

  if (action === "delete") {
    return { name, action: "delete" };
  }

  const value = await resolveParameterValue(spec, event);

  if (value === undefined) {
    throw new Error(`Parameter ${name} requires a value or valueFrom definition.`);
  }

  return {
    name,
    value,
    type,
    overwrite,
    action: spec.action ?? action ?? "put",
  };
}

async function sendCfnResponse(event, context, status, data = {}, error) {
  const responseBody = JSON.stringify({
    Status: status,
    Reason: error?.message ? `${error.message} (Log: ${context.logStreamName})` : `See CloudWatch Logs: ${context.logStreamName}`,
    PhysicalResourceId: event.PhysicalResourceId ?? context.logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: data,
  });

  await fetch(event.ResponseURL, {
    method: "PUT",
    body: responseBody,
    headers: {
      "Content-Type": "",
      "Content-Length": Buffer.byteLength(responseBody).toString(),
    },
  });
}

export const handler = async (event, context) => {
  try {
    const parameters = Array.isArray(event?.ResourceProperties?.Parameters)
      ? event.ResourceProperties.Parameters
      : [];

    if (!Array.isArray(parameters)) {
      throw new Error("ResourceProperties.Parameters must be an array.");
    }

    if (parameters.length === 0) {
      await sendCfnResponse(event, context, "SUCCESS", { message: "No parameters provided." });
      return;
    }

    const requestType = event.RequestType ?? "Create";
    const desiredAction = requestType === "Delete" ? "delete" : "put";
    const payloadParameters = [];

    for (const spec of parameters) {
      const normalized = await normalizeParameterSpec(spec, desiredAction, event);
      if (normalized) {
        payloadParameters.push(normalized);
      }
    }

    const result = await invokeParameterWriter({ parameters: payloadParameters });

    await sendCfnResponse(event, context, "SUCCESS", { invocationResult: result });
  } catch (error) {
    console.error("Parameter writer wrapper failed", error);
    await sendCfnResponse(event, context, "FAILED", {}, error);
  }
};
