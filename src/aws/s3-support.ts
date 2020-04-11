import AWS, {S3} from "aws-sdk";
import {DeleteObjectOutput, GetObjectOutput} from "aws-sdk/clients/s3";

export class S3Support {
  private static defaultRegion: string;

  constructor(private readonly s3?: S3) {
    if (!this.s3) {
      if(AWS.config.region)
        this.s3 = new S3();
      else if (S3Support.defaultRegion)
        this.s3 = new S3({region: S3Support.defaultRegion})
      else
        throw new Error("Default region is not available. Set default region by calling setRegion() method");
    }
  }

  public async getObjectContent(bucket: string, key: string): Promise<string> {
    const getObjectResult:GetObjectOutput = await this.s3.getObject({Bucket: bucket, Key: key}).promise();
    return getObjectResult.Body.toString();
  }

  public async deleteObject(bucket: string, key: string): Promise<boolean> {
    const deleteResult:DeleteObjectOutput = await this.s3.deleteObject({Bucket: bucket, Key: key}).promise();
    return deleteResult.DeleteMarker;
  }

  public static setRegion(region: string):void {
    S3Support.defaultRegion = region;
  }
}
