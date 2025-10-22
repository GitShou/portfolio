
import { expect } from 'chai';
import sinon from 'sinon';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

describe('delete-project handler', () => {
  let deleteProject;
  let sendStub;

  beforeEach(async () => {
    process.env.PROJECT_TABLE_NAME = 'ProjectsTable';
    process.env.REGION = 'ap-northeast-1';
    const module = await import('../src/delete-project/index.js');
    sendStub = sinon.stub();
    // ファクトリ経由でモッククライアントを渡し、ESMスタブの制約を回避。
    deleteProject = module.createHandler({ documentClient: { send: sendStub } });
  });

  afterEach(() => {
    sinon.restore();
    delete process.env.PROJECT_TABLE_NAME;
    delete process.env.REGION;
  });

  it('handlerが関数である', () => {
    expect(deleteProject).to.be.a('function');
  });

  it('既存プロジェクトを削除できる', async () => {
    sendStub.resolves({});

    const event = { pathParameters: { id: '100' } };

    const result = await deleteProject(event);

    expect(result.statusCode).to.equal(200);
    expect(JSON.parse(result.body).id).to.equal('100');
    expect(sendStub.calledOnceWithMatch(sinon.match.instanceOf(DeleteCommand))).to.be.true;
  });

  it('pathParametersにidが無い場合は400を返し、DynamoDBを呼ばない', async () => {
    const event = { pathParameters: {} };

    const result = await deleteProject(event);

    expect(result.statusCode).to.equal(400);
    expect(sendStub.notCalled).to.be.true;
  });

  it('DynamoDBエラー時は500を返す', async () => {
    sendStub.rejects(new Error('Not found'));

    const event = { pathParameters: { id: '9999' } };

    const result = await deleteProject(event);

    expect(result.statusCode).to.equal(500);
    expect(sendStub.calledOnce).to.be.true;
  });
});
