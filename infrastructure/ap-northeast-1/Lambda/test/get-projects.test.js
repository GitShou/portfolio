
import { expect } from 'chai';
import sinon from 'sinon';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

describe('get-projects handler', () => {
  let getProjects;
  let sendStub;

  beforeEach(async () => {
    process.env.PROJECT_TABLE_NAME = 'ProjectsTable';
    process.env.REGION = 'ap-northeast-1';
    const module = await import('../src/get-projects/index.js');
    sendStub = sinon.stub();
    // モッククライアントを注入してESMモジュールの直接スタブを避ける。
    getProjects = module.createHandler({ documentClient: { send: sendStub } });
  });

  afterEach(() => {
    sinon.restore();
    delete process.env.PROJECT_TABLE_NAME;
    delete process.env.REGION;
  });

  it('handlerが関数である', () => {
    expect(getProjects).to.be.a('function');
  });

  it('全プロジェクトを取得して200を返す', async () => {
    sendStub.resolves({ Items: [{ id: 1 }, { id: 2 }] });

    const result = await getProjects({});

    expect(result.statusCode).to.equal(200);
    const { projects } = JSON.parse(result.body);
    expect(projects).to.deep.equal([{ id: 1 }, { id: 2 }]);
    expect(sendStub.calledOnceWithMatch(sinon.match.instanceOf(ScanCommand))).to.be.true;
  });

  it('プロジェクトが存在しない場合は空配列を返す', async () => {
    sendStub.resolves({ Items: [] });

    const result = await getProjects({});

    expect(result.statusCode).to.equal(200);
    const { projects } = JSON.parse(result.body);
    expect(projects).to.be.an('array').that.is.empty;
  });

  it('DynamoDBエラー時は500を返す', async () => {
    sendStub.rejects(new Error('DynamoDB error'));

    const result = await getProjects({});

    expect(result.statusCode).to.equal(500);
    expect(sendStub.calledOnce).to.be.true;
  });
});
