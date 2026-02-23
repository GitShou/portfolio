import { DeleteParameterCommand, PutParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({
  region: process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION,
});

async function sendCfnResponse(event, context, status, data = {}, error) {
  const responseBody = JSON.stringify({
    Status: status,
    Reason: error?.message
      ? `${error.message} (Log: ${context.logStreamName})`
      : `See CloudWatch Logs: ${context.logStreamName}`,
    PhysicalResourceId:
      event.PhysicalResourceId ?? event.ResourceProperties?.Name ?? context.logStreamName,
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

function getName(resourceProperties) {
  const name = resourceProperties?.Name;
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new Error("Name is required.");
  }
  return name.trim();
}

function getValue(resourceProperties) {
  const value = resourceProperties?.Value;
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("Value is required.");
  }
  return value;
}

export const handler = async (event, context) => {
  try {
    const requestType = event?.RequestType;
    const name = getName(event?.ResourceProperties);

    if (requestType === "Delete") {
      try {
        await ssmClient.send(
          new DeleteParameterCommand({
            Name: name,
          })
        );
      } catch (error) {
        if (error?.name !== "ParameterNotFound") {
          throw error;
        }
      }
    } else {
      const value = getValue(event?.ResourceProperties);
      await ssmClient.send(
        new PutParameterCommand({
          Name: name,
          Type: "SecureString",
          Value: value,
          Overwrite: true,
        })
      );
    }

    await sendCfnResponse(event, context, "SUCCESS", { name });
  } catch (error) {
    console.error("Secure SSM parameter writer failed.", error);
    await sendCfnResponse(event, context, "FAILED", {}, error);
  }
};
