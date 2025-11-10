const ensureTrailingIndex = (uri) => {
  if (uri === "/") {
    return "/index.html";
  }

  if (uri.endsWith("/")) {
    return `${uri}index.html`;
  }

  const lastSegment = uri.slice(uri.lastIndexOf("/") + 1);
  if (lastSegment.includes(".")) {
    return uri;
  }

  return `${uri}/index.html`;
};

export const handler = async (event) => {
  const record = event?.Records?.[0];
  const request = record?.cf?.request;

  if (!request || typeof request.uri !== "string") {
    return request ?? event;
  }

  request.uri = ensureTrailingIndex(request.uri);
  console.log(
    JSON.stringify({
      message: "viewer-request rewrite invoked",
      uri: request.uri,
    })
  );
  throw new Error("debug");
};
