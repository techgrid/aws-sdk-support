import {GetQueueUrlResult, SendMessageResult} from "aws-sdk/clients/sqs";
import {SQS} from "aws-sdk";
import {SQSSupport} from "./sqs-support";

const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
AWSMock.setSDKInstance(AWS);

describe("SQSSupport", () => {
  let sqsSupport: SQSSupport;
  let queue: string;
  let message: any;

  beforeEach(() => {
    queue = "bucky";
    message = {"key":"value"};
  });

  it("should construct with sqs", () => {
    sqsSupport = new SQSSupport(new SQS());
    expect(sqsSupport).toBeDefined();
  });

  it("should construct with default region", () => {
    SQSSupport.setRegion("us-east-1");
    sqsSupport = new SQSSupport();
    expect(sqsSupport).toBeDefined();
  });

  it("should construct with AWS region", () => {
    AWS.config.region = "us-east-1";
    sqsSupport = new SQSSupport();
    expect(sqsSupport).toBeDefined();
  });

  it("should fail to construct with no region", () => {
    AWS.config.region = null;
    SQSSupport.setRegion(null);
    expect(() => new SQSSupport()).toThrow();
  });

  it("should send message to queue with logging", async () => {
    const queueUrl = {QueueUrl: "http:localhost:8080/queue"} as GetQueueUrlResult;
    const result = <SendMessageResult>{};
    AWSMock.mock("SQS", "getQueueUrl", Promise.resolve(queueUrl));
    AWSMock.mock("SQS", "sendMessage", Promise.resolve(result));
    sqsSupport = new SQSSupport(new SQS());
    sqsSupport.enableLogging();
    const object = await sqsSupport.sendMessage(queue, message);
    expect(object).toEqual(result);
  });

  it("should send message to queue with no logging", async () => {
    const queueUrl = {QueueUrl: "http:localhost:8080/queue"} as GetQueueUrlResult;
    const result = <SendMessageResult>{};
    AWSMock.mock("SQS", "getQueueUrl", Promise.resolve(queueUrl));
    AWSMock.mock("SQS", "sendMessage", Promise.resolve(result));
    sqsSupport = new SQSSupport(new SQS());
    sqsSupport.disableLogging();
    const object = await sqsSupport.sendMessage(queue, message);
    expect(object).toEqual(result);
  });
});
