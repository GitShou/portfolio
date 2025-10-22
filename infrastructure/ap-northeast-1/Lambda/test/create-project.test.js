
import { expect } from 'chai';
import sinon from 'sinon';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

describe('create-project handler', () => {
  let createProject;
  let sendStub;

  beforeEach(async () => {
    process.env.PROJECT_TABLE_NAME = 'ProjectsTable';
    process.env.REGION = 'ap-northeast-1';
    const module = await import('../src/create-project/index.js');
    sendStub = sinon.stub();
    // ESMの直接スタブを避けるため、ファクトリにモック依存を注入する。
    const uuidStub = sinon.stub().returns('mock-uuid-1234');
    createProject = module.createHandler({ documentClient: { send: sendStub }, uuidGenerator: uuidStub });
  });

  afterEach(() => {
    sinon.restore();
    delete process.env.PROJECT_TABLE_NAME;
    delete process.env.REGION;
  });

  it('handlerが関数である', () => {
    expect(createProject).to.be.a('function');
  });

  it('必須項目が揃っていればプロジェクトを作成し201を返す', async () => {
    sendStub.resolves({});

    const event = {
      body: JSON.stringify({
        title: '新規プロジェクト',
        summary: 'テスト用プロジェクト',
        techStack: ['Node.js']
      })
    };

    const result = await createProject(event);

    expect(result.statusCode).to.equal(201);
    const body = JSON.parse(result.body);
    expect(body.project.id).to.equal('mock-uuid-1234');
    expect(sendStub.calledOnceWithMatch(sinon.match.instanceOf(PutCommand))).to.be.true;
  });

  it('DynamoDBエラー時は500を返す', async () => {
    sendStub.rejects(new Error('Duplicate'));

    const event = {
      body: JSON.stringify({
        title: '重複プロジェクト',
        summary: '重複テスト',
        techStack: ['Node.js']
      })
    };

    const result = await createProject(event);

    expect(result.statusCode).to.equal(500);
    expect(sendStub.calledOnce).to.be.true;
  });

  it('必須項目が不足している場合は400を返し、DynamoDBを呼ばない', async () => {
    const event = {
      body: JSON.stringify({
        title: '必須項目不足',
      })
    };

    const result = await createProject(event);

    expect(result.statusCode).to.equal(400);
    expect(sendStub.notCalled).to.be.true;
  });
});
