import AWS, {S3} from 'aws-sdk';
import {DeleteObjectOutput, GetObjectOutput, ListObjectsV2Output} from 'aws-sdk/clients/s3';
import {SdkSupport} from './sdk-support';

export class S3Client {

  constructor(private readonly s3?: S3) {
    if (!this.s3) {
      if (AWS.config.region) {
        this.s3 = new S3();
      } else if (S3Client.defaultRegion || SdkSupport.defaultRegion) {
        this.s3 = new S3({region: S3Client.defaultRegion || SdkSupport.defaultRegion});
 } else {
        throw new Error('Default region is not available. Set default region by calling setRegion() method');
 }
    }
  }
  private static defaultRegion: string;

  public static setRegion(region: string): void {
    S3Client.defaultRegion = region;
  }

  public async getObjectContent(bucket: string, key: string): Promise<string> {
    const result: GetObjectOutput = await this.s3.getObject({Bucket: bucket, Key: key}).promise();
    return result.Body.toString();
  }

  public async getObjectList(bucket: string, prefix: string): Promise<Array<string>> {
    const result: ListObjectsV2Output = await this.s3.listObjectsV2({Bucket: bucket, Prefix: prefix}).promise();
    return result.Contents.map(c => c.Key);
  }

  public async deleteObject(bucket: string, key: string): Promise<boolean> {
    const deleteResult: DeleteObjectOutput = await this.s3.deleteObject({Bucket: bucket, Key: key}).promise();
    return deleteResult.DeleteMarker;
  }
}
