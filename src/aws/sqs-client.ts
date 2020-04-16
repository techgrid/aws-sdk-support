import AWS, {SQS} from "aws-sdk";
import {ReceiveMessageResult, SendMessageResult} from "aws-sdk/clients/sqs";
import {SdkSupport} from "./sdk-support";
import {AWSError} from "aws-sdk/lib/error";

export class SqsClient {
  private static defaultRegion: string;
  constructor(private readonly sqs?: SQS) {
    if(!sqs) {
      if(AWS.config.region)
        this.sqs = new SQS();
      else if (SqsClient.defaultRegion || SdkSupport.defaultRegion)
        this.sqs = new SQS({region: SqsClient.defaultRegion || SdkSupport.defaultRegion})
      else
        throw new Error("Default region is not available. Set default region by calling setRegion() method");
    }
  }

  public async sendMessage(queue: string,
                           body: any,
                           successCallback?: (result?: SendMessageResult) => void,
                           errorCallback?: (err: AWSError) => void): Promise<void> {
    const queueUrl = await this.getQueueUrl(queue);

    this.sqs.sendMessage({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(body),
      }, (err:AWSError, result: SendMessageResult) => {
      if(err && errorCallback)
        errorCallback(err);
      else if(successCallback)
        successCallback(result);
    });
  }

  public async receiveMessage(queue: string,
                              options: {count?: number, timeout?: number, delete?: boolean},
                              successCallback?: (result?: string) => void,
                              errorCallback?: (err: AWSError) => void): Promise<void> {
    const queueUrl = await this.getQueueUrl(queue);

    this.sqs.receiveMessage({
      MaxNumberOfMessages: options.count ? options.count : 1,
      WaitTimeSeconds: options.timeout ? options.timeout : 5,
      QueueUrl: queueUrl,
    }, (err: AWSError, result:ReceiveMessageResult) => {
      if (err && errorCallback)
        errorCallback(err);
      else if (successCallback)
        result.Messages.forEach(m => successCallback(m.Body));
      if (!err && options.delete)
        result.Messages.forEach(m => this.sqs.deleteMessage({QueueUrl: queueUrl, ReceiptHandle: m.ReceiptHandle}));
    });
  }

  private async getQueueUrl(queue: string): Promise<string> {
    const result = await this.sqs.getQueueUrl({QueueName: queue}).promise();
    return Promise.resolve(result.QueueUrl);
  }

  public static setRegion(region: string):void {
    SqsClient.defaultRegion = region;
  }
}
