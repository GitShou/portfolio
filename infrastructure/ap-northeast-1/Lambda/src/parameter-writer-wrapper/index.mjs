import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const TARGET_FUNCTION_ARN = process.env.PARAMETER_WRITER_FUNCTION_ARN;

if (!TARGET_FUNCTION_ARN) {
  throw new Error("PARAMETER_WRITER_FUNCTION_ARN environment variable is required.");
}

const client = new LambdaClient({});

const textDecoder = new TextDecoder("utf-8");

async function invokeParameterWriter(payload) {
  const response = await client.send(
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

function normalizeParameterSpec(spec, action) {
  if (!spec) {
    return null;
  }

  const name = spec.name ?? spec.Name;
  const value = spec.value ?? spec.Value;
  const type = spec.type ?? spec.Type;
  const overwrite = spec.overwrite ?? spec.Overwrite;

  if (!name) {
    throw new Error("Each parameter entry must include a name.");
  }

  if (action === "delete") {
    return { name, action: "delete" };
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
    const payloadParameters = parameters.map((spec) => normalizeParameterSpec(spec, desiredAction));

    const result = await invokeParameterWriter({ parameters: payloadParameters });

    await sendCfnResponse(event, context, "SUCCESS", { invocationResult: result });
  } catch (error) {
    console.error("Parameter writer wrapper failed", error);
    await sendCfnResponse(event, context, "FAILED", {}, error);
  }
};
