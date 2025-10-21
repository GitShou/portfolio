const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

let documentClientMock;
let getProjects;

beforeEach(() => {
  documentClientMock = {
    scan: sinon.stub()
  };
  const AWSMock = {
    DynamoDB: {
      DocumentClient: function() { return documentClientMock; }
    }
  };
  getProjects = proxyquire('../src/get-projects/index', {
    'aws-sdk': AWSMock
  }).handler;
});

describe('get-projects', () => {
  it('関数であること', () => {
    expect(getProjects).to.be.a('function');
  });


  it('全プロジェクトを取得できる', async () => {
    documentClientMock.scan.returns({ promise: () => Promise.resolve({ Items: [{ id: 1 }, { id: 2 }] }) });
    const event = {};
    const result = await getProjects(event);
    expect(result).to.have.property('statusCode', 200);
    const projects = JSON.parse(result.body).projects;
    expect(projects).to.be.an('array');
    expect(projects.length).to.equal(2);
  });

  it('プロジェクトが存在しない場合は空配列を返す', async () => {
    documentClientMock.scan.returns({ promise: () => Promise.resolve({ Items: [] }) });
    const event = {};
    const result = await getProjects(event);
    expect(result).to.have.property('statusCode', 200);
    const projects = JSON.parse(result.body).projects;
    expect(projects).to.be.an('array').that.is.empty;
  });

  it('DynamoDBエラー時に例外を返す', async () => {
    documentClientMock.scan.returns({ promise: () => Promise.reject(new Error('DynamoDB error')) });
    const event = {};
    try {
      await getProjects(event);
    } catch (err) {
      expect(err).to.exist;
    }
  });
});
