
import { expect } from 'chai';
import sinon from 'sinon';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

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
    sendStub.resolves({ Attributes: { id: '100', title: '更新後タイトル' } });

    const event = {
      pathParameters: { id: '100' },
      body: JSON.stringify({ title: '更新後タイトル' })
    };

    const result = await updateProject(event);

    expect(result.statusCode).to.equal(200);
    const response = JSON.parse(result.body);
    expect(response.project).to.deep.equal({ id: '100', title: '更新後タイトル' });
    expect(sendStub.calledOnceWithMatch(sinon.match.instanceOf(UpdateCommand))).to.be.true;
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
    sendStub.rejects(new Error('Not found'));

    const event = {
      pathParameters: { id: '9999' },
      body: JSON.stringify({ title: '存在しないID' })
    };

    const result = await updateProject(event);

    expect(result.statusCode).to.equal(500);
    expect(sendStub.calledOnce).to.be.true;
  });
});
