import AWS, {SQS} from "aws-sdk";
import {SendMessageResult} from "aws-sdk/clients/sqs";

export class SqsClient {
  private logging = false;
  private static defaultRegion: string;
  constructor(private readonly sqs?: SQS) {
    if(!sqs) {
      if(AWS.config.region)
        this.sqs = new SQS();
      else if (SqsClient.defaultRegion)
        this.sqs = new SQS({region: SqsClient.defaultRegion})
      else
        throw new Error("Default region is not available. Set default region by calling setRegion() method");
    }
  }

  public async sendMessage(queue: string, body: any): Promise<SendMessageResult> {
    if (this.logging)
      console.log(`Sending message to queue: ${queue}`)
    let queueUrl = await this.getQueueUrl(queue);
    if (this.logging)
      console.log(`Queue URL : ${queueUrl}`);

    return this.sqs.sendMessage({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(body),
      }).promise();
  }

  private async getQueueUrl(queue: string): Promise<string> {
    const result = await this.sqs.getQueueUrl({QueueName: queue}).promise();
    return Promise.resolve(result.QueueUrl);
  }

  public static setRegion(region: string):void {
    SqsClient.defaultRegion = region;
  }

  public enableLogging(): void {
    this.logging = true;
  }

  public disableLogging(): void {
    this.logging = false;
  }
}
