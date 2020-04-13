import {GetQueueUrlResult, SendMessageResult} from "aws-sdk/clients/sqs";
import {SQS} from "aws-sdk";
import {SqsClient} from "./sqs-client";

const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
AWSMock.setSDKInstance(AWS);

describe("SQSSupport", () => {
  let sqsSupport: SqsClient;
  let queue: string;
  let message: any;

  beforeEach(() => {
    queue = "bucky";
    message = {"key":"value"};
  });

  it("should construct with sqs", () => {
    sqsSupport = new SqsClient(new SQS());
    expect(sqsSupport).toBeDefined();
  });

  it("should construct with default region", () => {
    SqsClient.setRegion("us-east-1");
    sqsSupport = new SqsClient();
    expect(sqsSupport).toBeDefined();
  });

  it("should construct with AWS region", () => {
    AWS.config.region = "us-east-1";
    sqsSupport = new SqsClient();
    expect(sqsSupport).toBeDefined();
  });

  it("should fail to construct with no region", () => {
    AWS.config.region = null;
    SqsClient.setRegion(null);
    expect(() => new SqsClient()).toThrow();
  });

  it("should send message to queue with logging", async () => {
    const queueUrl = {QueueUrl: "http:localhost:8080/queue"} as GetQueueUrlResult;
    const result = <SendMessageResult>{};
    AWSMock.mock("SQS", "getQueueUrl", Promise.resolve(queueUrl));
    AWSMock.mock("SQS", "sendMessage", Promise.resolve(result));
    sqsSupport = new SqsClient(new SQS());
    sqsSupport.enableLogging();
    const object = await sqsSupport.sendMessage(queue, message);
    expect(object).toEqual(result);
  });

  it("should send message to queue with no logging", async () => {
    const queueUrl = {QueueUrl: "http:localhost:8080/queue"} as GetQueueUrlResult;
    const result = <SendMessageResult>{};
    AWSMock.mock("SQS", "getQueueUrl", Promise.resolve(queueUrl));
    AWSMock.mock("SQS", "sendMessage", Promise.resolve(result));
    sqsSupport = new SqsClient(new SQS());
    sqsSupport.disableLogging();
    const object = await sqsSupport.sendMessage(queue, message);
    expect(object).toEqual(result);
  });
});
