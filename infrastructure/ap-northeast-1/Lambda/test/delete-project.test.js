const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

let documentClientMock;
let deleteProject;

beforeEach(() => {
  documentClientMock = {
    delete: sinon.stub()
  };
  const AWSMock = {
    DynamoDB: {
      DocumentClient: function() { return documentClientMock; }
    }
  };
  deleteProject = proxyquire('../src/delete-project/index', {
    'aws-sdk': AWSMock
  }).handler;
});

describe('delete-project', () => {
  it('関数であること', () => {
    expect(deleteProject).to.be.a('function');
  });

  it('既存プロジェクトを削除できる', async () => {
    // 削除成功時のモック
    documentClientMock.delete.returns({ promise: () => Promise.resolve({ Attributes: { id: 100 } }) });
    const event = {
      pathParameters: { id: 100 }
    };
    const result = await deleteProject(event);
    expect(result).to.have.property('statusCode', 200);
    expect(JSON.parse(result.body)).to.have.property('id', 100);
  });

  it('存在しないIDの削除は失敗する', async () => {
    // 削除失敗時のモック
    documentClientMock.delete.returns({ promise: () => Promise.reject(new Error('Not found')) });
    const event = {
      pathParameters: { id: 9999 }
    };
    const result = await deleteProject(event);
    expect(result.statusCode).to.not.equal(200);
  });
});
