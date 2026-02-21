import { expect } from "chai";
import sinon from "sinon";

describe("track-page-view handler", () => {
  let trackPageView;
  let logger;
  let s3SendStub;
  let createPutObjectCommand;

  beforeEach(async () => {
    process.env.BEACON_LOG_BUCKET_NAME = "portfolio-test-beacon-logs";
    process.env.BEACON_LOG_PREFIX = "events/";
    const module = await import("../src/track-page-view/index.js");
    logger = { log: sinon.stub(), error: sinon.stub() };
    s3SendStub = sinon.stub().resolves({});
    createPutObjectCommand = sinon.stub().callsFake((input) => ({ input }));
    trackPageView = module.createHandler({
      logger,
      s3Client: { send: s3SendStub },
      putObjectCommandFactory: createPutObjectCommand,
    });
  });

  afterEach(() => {
    sinon.restore();
    delete process.env.BEACON_LOG_BUCKET_NAME;
    delete process.env.BEACON_LOG_PREFIX;
  });

  it("handlerが関数である", () => {
    expect(trackPageView).to.be.a("function");
  });

  it("OPTIONSは204を返す", async () => {
    const result = await trackPageView({
      httpMethod: "OPTIONS",
    });

    expect(result.statusCode).to.equal(204);
    expect(logger.log.notCalled).to.be.true;
    expect(s3SendStub.notCalled).to.be.true;
  });

  it("JSONが壊れている場合は400を返す", async () => {
    const result = await trackPageView({
      httpMethod: "POST",
      body: "{invalid-json",
    });

    expect(result.statusCode).to.equal(400);
    expect(logger.log.notCalled).to.be.true;
    expect(s3SendStub.notCalled).to.be.true;
  });

  it("プロジェクトページ遷移を正規化して204を返す", async () => {
    const result = await trackPageView({
      httpMethod: "POST",
      body: JSON.stringify({
        eventType: "page_view",
        path: "/projects/1/",
        fromPath: "/",
        timestamp: "2026-02-20T00:00:00.000Z",
      }),
      headers: {
        "user-agent": "Mozilla/5.0",
      },
      requestContext: {
        identity: { sourceIp: "192.0.2.1" },
        requestId: "req-123",
      },
    });

    expect(result.statusCode).to.equal(204);
    expect(logger.log.calledOnce).to.be.true;
    expect(createPutObjectCommand.calledOnce).to.be.true;
    expect(s3SendStub.calledOnce).to.be.true;

    const putObjectInput = createPutObjectCommand.firstCall.args[0];
    expect(putObjectInput.Bucket).to.equal("portfolio-test-beacon-logs");
    expect(putObjectInput.Key).to.match(/^events\/year=/);
    expect(putObjectInput.ContentType).to.equal("application/json");

    const logged = JSON.parse(logger.log.firstCall.args[0]);
    expect(logged.message).to.equal("page-view-event");
    expect(logged.bucketName).to.equal("portfolio-test-beacon-logs");
    expect(logged.toPath).to.equal("/projects/1");
    expect(logged.fromPath).to.equal("/");
    expect(logged.tracked).to.equal(true);
  });

  it("toPathがない場合は400を返す", async () => {
    const result = await trackPageView({
      httpMethod: "POST",
      body: JSON.stringify({
        eventType: "page_view",
      }),
    });

    expect(result.statusCode).to.equal(400);
    expect(logger.log.notCalled).to.be.true;
    expect(s3SendStub.notCalled).to.be.true;
  });

  it("S3保存に失敗した場合は500を返す", async () => {
    s3SendStub.rejects(new Error("s3 error"));

    const result = await trackPageView({
      httpMethod: "POST",
      body: JSON.stringify({
        eventType: "page_view",
        path: "/projects/1",
      }),
    });

    expect(result.statusCode).to.equal(500);
  });

  it("バケット設定が無い場合は500を返す", async () => {
    delete process.env.BEACON_LOG_BUCKET_NAME;

    const result = await trackPageView({
      httpMethod: "POST",
      body: JSON.stringify({
        eventType: "page_view",
        path: "/projects/1",
      }),
    });

    expect(result.statusCode).to.equal(500);
    expect(s3SendStub.notCalled).to.be.true;
  });
});
