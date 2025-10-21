const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();

const sinon = require('sinon');
let documentClientMock;
let createProject;
const uuidMock = () => 'mock-uuid-1234';

beforeEach(() => {
  documentClientMock = {
    put: sinon.stub(),
    get: sinon.stub()
  };
  const AWSMock = {
    DynamoDB: {
      DocumentClient: function() { return documentClientMock; }
    }
  };
  createProject = proxyquire('../src/create-project/index', {
    'aws-sdk': AWSMock,
    'uuid': { v4: uuidMock }
  }).handler;
});

describe('create-project', () => {
  it('関数であること', () => {
    expect(createProject).to.be.a('function');
  });

  it('必須項目でプロジェクト作成できる', async () => {
    documentClientMock.put.returns({ promise: () => Promise.resolve({ Attributes: { id: 100 } }) });
    const event = {
      body: JSON.stringify({
        id: 100,
        title: '新規プロジェクト',
        summary: 'テスト用プロジェクト',
        techStack: [{ name: 'Node.js', icon: '' }]
      })
    };
    const result = await createProject(event);
  expect(result).to.have.property('statusCode', 201);
  const body = JSON.parse(result.body);
  expect(body).to.have.property('project');
  expect(body.project).to.have.property('id', 'mock-uuid-1234');
  });

  it('重複idでは作成に失敗する', async () => {
    documentClientMock.put.returns({ promise: () => Promise.reject(new Error('Duplicate')) });
    const event = {
      body: JSON.stringify({
        id: 100,
        title: '重複プロジェクト',
        summary: '重複テスト',
        techStack: [{ name: 'Node.js', icon: '' }]
      })
    };
    const result = await createProject(event);
    expect(result.statusCode).to.not.equal(200);
  });

  it('必須項目が不足している場合は失敗する', async () => {
    documentClientMock.put.returns({ promise: () => Promise.reject(new Error('Validation error')) });
    const event = {
      body: JSON.stringify({
        title: '必須項目不足',
        summary: 'idがない'
      })
    };
    const result = await createProject(event);
    expect(result.statusCode).to.not.equal(200);
  });
});
