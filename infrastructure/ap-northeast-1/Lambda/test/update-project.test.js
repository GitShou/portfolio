const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

let documentClientMock;
let updateProject;
const uuidMock = () => 'mock-uuid-5678';

beforeEach(() => {
  documentClientMock = {
    update: sinon.stub()
  };
  const AWSMock = {
    DynamoDB: {
      DocumentClient: function() { return documentClientMock; }
    }
  };
  updateProject = proxyquire('../src/update-project/index', {
    'aws-sdk': AWSMock,
    'uuid': { v4: uuidMock }
  }).handler;
});

describe('update-project', () => {
  it('関数であること', () => {
    expect(updateProject).to.be.a('function');
  });

  it('既存プロジェクトを更新できる', async () => {
    documentClientMock.update.returns({ promise: () => Promise.resolve({ Attributes: { title: '更新後タイトル' } }) });
    const event = {
      pathParameters: { id: 100 },
      body: JSON.stringify({ title: '更新後タイトル' })
    };
    const result = await updateProject(event);
    expect(result).to.have.property('statusCode', 200);
    expect(JSON.parse(result.body).project.title).to.equal('更新後タイトル');
  });

  it('存在しないIDの更新は失敗する', async () => {
    documentClientMock.update.returns({ promise: () => Promise.reject(new Error('Not found')) });
    const event = {
      pathParameters: { id: 9999 },
      body: JSON.stringify({ title: '存在しないID' })
    };
    const result = await updateProject(event);
    expect(result.statusCode).to.not.equal(200);
  });

  it('更新データが不正な場合は失敗する', async () => {
    documentClientMock.update.returns({ promise: () => Promise.reject(new Error('Validation error')) });
    const event = {
      pathParameters: { id: 100 },
      body: JSON.stringify({ title: 12345 })
    };
    const result = await updateProject(event);
    expect(result.statusCode).to.not.equal(200);
  });
});
