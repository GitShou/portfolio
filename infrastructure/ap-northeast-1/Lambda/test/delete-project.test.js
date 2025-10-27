
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
    sendStub.resolves({
      Attributes: {
        EntityPartitionKey: 'PROJECT#100',
        EntitySortKey: 'PROFILE',
      },
    });

    const event = { pathParameters: { id: '100' } };

    const result = await deleteProject(event);

    expect(result.statusCode).to.equal(200);
    expect(JSON.parse(result.body).id).to.equal('100');
    expect(sendStub.calledOnceWithMatch(sinon.match.instanceOf(DeleteCommand))).to.be.true;
    const deleteCommand = sendStub.firstCall.args[0];
    expect(deleteCommand.input.Key).to.deep.equal({
      EntityPartitionKey: 'PROJECT#100',
      EntitySortKey: 'PROFILE',
    });
  });

  it('pathParametersにidが無い場合は400を返し、DynamoDBを呼ばない', async () => {
    const event = { pathParameters: {} };

    const result = await deleteProject(event);

    expect(result.statusCode).to.equal(400);
    expect(sendStub.notCalled).to.be.true;
  });

  it('対象プロジェクトが存在しない場合は404を返す', async () => {
    sendStub.resolves({ Attributes: undefined });

    const event = { pathParameters: { id: '404' } };

    const result = await deleteProject(event);

    expect(result.statusCode).to.equal(404);
    expect(sendStub.calledOnce).to.be.true;
  });

  it('DynamoDBエラー時は500を返す', async () => {
    sendStub.rejects(new Error('Not found'));

    const event = { pathParameters: { id: '9999' } };

    const result = await deleteProject(event);

    expect(result.statusCode).to.equal(500);
    expect(sendStub.calledOnce).to.be.true;
  });
});
