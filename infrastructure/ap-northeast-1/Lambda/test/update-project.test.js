
import { expect } from 'chai';
import sinon from 'sinon';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

describe('update-project handler', () => {
  let updateProject;
  let sendStub;

  beforeEach(async () => {
    process.env.PROJECT_TABLE_NAME = 'ProjectsTable';
    process.env.REGION = 'ap-northeast-1';
    const module = await import('../src/update-project/index.js');
    sendStub = sinon.stub();
    // テストではファクトリにモックを渡してESM依存のスタブ問題を解消。
    updateProject = module.createHandler({ documentClient: { send: sendStub } });
  });

  afterEach(() => {
    sinon.restore();
    delete process.env.PROJECT_TABLE_NAME;
    delete process.env.REGION;
  });

  it('handlerが関数である', () => {
    expect(updateProject).to.be.a('function');
  });

  it('既存プロジェクトを更新して200を返す', async () => {
    sendStub.onFirstCall().resolves({
      Item: {
        EntityPartitionKey: 'PROJECT#100',
        EntitySortKey: 'PROFILE',
        PortfolioIndexPartitionKey: 'PORTFOLIO#ALL',
        PortfolioIndexSortKey: 'ORDER#0001',
        id: '100',
        title: '旧タイトル',
        summary: '旧要約',
        techStack: ['Node.js'],
        metadata: { order: 1, status: 'PUBLISHED', updatedAt: '2024-01-01T00:00:00Z' },
      },
    });
    sendStub.onSecondCall().resolves({});

    const event = {
      pathParameters: { id: '100' },
      body: JSON.stringify({ title: '更新後タイトル' })
    };

    const result = await updateProject(event);

    expect(result.statusCode).to.equal(200);
    const response = JSON.parse(result.body);
  expect(response.project.id).to.equal('100');
  expect(response.project.title).to.equal('更新後タイトル');
  expect(sendStub.firstCall.args[0]).to.be.instanceOf(GetCommand);
  expect(sendStub.secondCall.args[0]).to.be.instanceOf(PutCommand);
  });

  it('idまたはbodyが無い場合は400を返し、DynamoDBを呼ばない', async () => {
    const event = {
      pathParameters: {},
      body: JSON.stringify({ title: '更新後タイトル' })
    };

    const result = await updateProject(event);

  expect(result.statusCode).to.equal(400);
  expect(sendStub.notCalled).to.be.true;
  });

  it('DynamoDBエラー時は500を返す', async () => {
    sendStub.onFirstCall().resolves({
      Item: {
        EntityPartitionKey: 'PROJECT#9999',
        EntitySortKey: 'PROFILE',
        PortfolioIndexPartitionKey: 'PORTFOLIO#ALL',
        PortfolioIndexSortKey: 'ORDER#9999',
        id: '9999',
        metadata: { order: 9999 },
      },
    });
    sendStub.onSecondCall().rejects(new Error('Not found'));

    const event = {
      pathParameters: { id: '9999' },
      body: JSON.stringify({ title: '存在しないID' })
    };

    const result = await updateProject(event);

  expect(result.statusCode).to.equal(500);
  expect(sendStub.calledTwice).to.be.true;
  });

  it('対象プロジェクトが存在しない場合は404を返す', async () => {
    sendStub.onFirstCall().resolves({ Item: undefined });

    const event = {
      pathParameters: { id: '101' },
      body: JSON.stringify({ title: '更新後タイトル' })
    };

    const result = await updateProject(event);

    expect(result.statusCode).to.equal(404);
    expect(sendStub.calledOnce).to.be.true;
  });
});
