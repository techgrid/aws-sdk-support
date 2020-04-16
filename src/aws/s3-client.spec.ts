import {S3Client} from "./s3-client";
import {DeleteObjectOutput, GetObjectOutput, ListObjectsV2Output} from "aws-sdk/clients/s3";
import {S3} from "aws-sdk";
import {SdkSupport} from "./sdk-support";

const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
AWSMock.setSDKInstance(AWS);

describe("S3Support", () => {
  let s3Support: S3Client;
  let bucket: string;
  let key: string;

  beforeEach(() => {
    bucket = "bucky";
    key = "object";
  });

  it("should construct with s3", () => {
    s3Support = new S3Client(new S3());
    expect(s3Support).toBeDefined();
  });

  it("should construct with default region", () => {
    S3Client.setRegion("us-east-1");
    s3Support = new S3Client();
    expect(s3Support).toBeDefined();
  });

  it("should construct with AWS region", () => {
    AWS.config.region = "us-east-1";
    s3Support = new S3Client();
    expect(s3Support).toBeDefined();
  });

  it("should construct with Sdk region", () => {
    AWS.config.region = null;
    SdkSupport.defaultRegion = "us-east-1";
    S3Client.setRegion(null);
    s3Support = new S3Client();
    expect(s3Support).toBeDefined();
  });

  it("should fail to construct with no region", () => {
    AWS.config.region = null;
    SdkSupport.defaultRegion = null;
    S3Client.setRegion(null);
    expect(() => new S3Client()).toThrow();
  });

  it("should get object", async () => {
    const o = { Body: "2019010120190107" } as GetObjectOutput;
    AWSMock.mock("S3", "getObject",  Promise.resolve(o));
    const s3 = new S3();
    s3Support = new S3Client(s3);

    const object = await s3Support.getObjectContent(bucket, key);
    expect(object).toEqual("2019010120190107");
  });

  it("should get list", async () => {
    const o = {Contents: [{Key: "1"}, {Key: "2"}]} as ListObjectsV2Output;
    AWSMock.mock("S3", "listObjectsV2",  Promise.resolve(o));
    const s3 = new S3();
    s3Support = new S3Client(s3);

    const object = await s3Support.getObjectList(bucket, key);
    expect(object).toContain("1");
  });

  it("should delete object", async () => {
    const s3 = new S3();
    const deleted = <DeleteObjectOutput>{DeleteMarker: true};
    AWSMock.mock("S3", "deleteObject", Promise.resolve(deleted));

    s3Support = new S3Client(s3);
    const actual = await s3Support.deleteObject(bucket, key);
    expect(actual).toBe(true);
  });
});
