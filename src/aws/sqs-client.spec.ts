import {
  DeleteMessageRequest,
  GetQueueUrlResult,
  ReceiveMessageRequest,
  ReceiveMessageResult,
  SendMessageRequest,
  SendMessageResult
} from 'aws-sdk/clients/sqs';
import {AWSError, SQS} from 'aws-sdk';
import {SqsClient} from './sqs-client';
import {SdkSupport} from './sdk-support';

const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
AWSMock.setSDKInstance(AWS);

describe('SQSSupport', () => {
  let sqsSupport: SqsClient;
  let queue: string;
  let message: any;

  beforeEach(() => {
    queue = 'bucky';
    message = {'key': 'value'};
    const queueUrl = {QueueUrl: 'http:localhost:8080/queue'} as GetQueueUrlResult;
    AWSMock.mock('SQS', 'getQueueUrl', Promise.resolve(queueUrl));
  });

  it('should construct with sqs', () => {
    sqsSupport = new SqsClient(new SQS());
    expect(sqsSupport).toBeDefined();
  });

  it('should construct with default region', () => {
    SqsClient.setRegion('us-east-1');
    sqsSupport = new SqsClient();
    expect(sqsSupport).toBeDefined();
  });

  it('should construct with AWS region', () => {
    AWS.config.region = 'us-east-1';
    sqsSupport = new SqsClient();
    expect(sqsSupport).toBeDefined();
  });

  it('should construct with Sdk region', () => {
    AWS.config.region = null;
    SqsClient.setRegion(null);
    SdkSupport.defaultRegion = 'us-east-1';
    sqsSupport = new SqsClient();
    expect(sqsSupport).toBeDefined();
  });

  it('should fail to construct with no region', () => {
    AWS.config.region = null;
    SdkSupport.defaultRegion = null;
    SqsClient.setRegion(null);
    expect(() => new SqsClient()).toThrow();
  });

  it('should send message to queue', async () => {
    const result = <SendMessageResult>{};
    const callback = jest.fn();
    AWSMock.mock('SQS', 'sendMessage', Promise.resolve(result));
    sqsSupport = new SqsClient(new SQS());
    await sqsSupport.sendMessage(queue, message, callback);
    expect(callback).toBeCalledTimes(1);
  });

  it('should send message to queue and not call callback', async () => {
    const result = <SendMessageResult>{};
    const callback = jest.fn();
    AWSMock.mock('SQS', 'sendMessage', Promise.resolve(result));
    sqsSupport = new SqsClient(new SQS());
    await sqsSupport.sendMessage(queue, message);
    expect(callback).toBeCalledTimes(0);
  });

  it('should call error callback on send failure', async () => {
    const errorCallback = jest.fn();
    AWSMock.remock('SQS', 'sendMessage', (params: SendMessageRequest, callback: Function) => {
      console.log('SQS', 'sendMessage', 'mock called', params);
      callback({} as AWSError, {});
    });
    sqsSupport = new SqsClient(new SQS());
    await sqsSupport.sendMessage(queue, message, null, errorCallback);
    expect(errorCallback).toBeCalledTimes(1);
  });

  it('should receive message from queue', async () => {
    const result = <ReceiveMessageResult>{Messages: [{ReceiptHandle: '123', Body: 'body'}]};
    const successCallback = jest.fn();
    AWSMock.mock('SQS', 'receiveMessage', (params: ReceiveMessageRequest, callback: Function) => {
      console.log('SQS', 'receiveMessage', 'mock called', params);
      callback(null, result);
    });
    sqsSupport = new SqsClient(new SQS());
    await sqsSupport.receiveMessage(queue, {timeout: 30}, successCallback);
    expect(successCallback).toBeCalledTimes(1);
  });

  it('should delete message from queue after receiving', async () => {
    const result = <ReceiveMessageResult>{Messages: [{ReceiptHandle: '123', Body: 'body'}]};
    const deleteMessage = jest.fn();
    AWSMock.mock('SQS', 'deleteMessage', (p: DeleteMessageRequest, c: Function) => {
      deleteMessage(p, c);
    });
    AWSMock.mock('SQS', 'receiveMessage', (params: ReceiveMessageRequest, callback: Function) => {
      console.log('SQS', 'receiveMessage', 'mock called', params);
      callback(null, result);
    });
    sqsSupport = new SqsClient(new SQS());
    await sqsSupport.receiveMessage(queue, {delete: true}, null);
    expect(deleteMessage).toBeCalledTimes(1);
  });

  it('should call error callback on receive failure', async () => {
    const errorCallback = jest.fn();
    AWSMock.remock('SQS', 'receiveMessage', (params: SendMessageRequest, callback: Function) => {
      console.log('SQS', 'sendMessage', 'mock called', params);
      callback({} as AWSError, {});
    });
    sqsSupport = new SqsClient(new SQS());
    await sqsSupport.receiveMessage(queue, {count: 2}, null, errorCallback);
    expect(errorCallback).toBeCalledTimes(1);
  });
});
