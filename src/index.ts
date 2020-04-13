import {SQSSupport} from "./aws/sqs-support";
import {S3Support} from "./aws/s3-support";
import S3 from "aws-sdk/clients/s3";
import SQS from "aws-sdk/clients/sqs";

module.exports = {
    SQS: SQSSupport,
    S3: S3Support,
    SQSSupport: SQSSupport,
    S3Support: S3Support,
    defaultSQSInstance: (region?: string) => {
        SQSSupport.setRegion(region);
        return new SQSSupport();
    },
    defaultS3Instance: (region?: string) => {
        S3Support.setRegion(region);
        return new S3Support();
    },
    sqsInstance: (sqs: SQS, region?: string) => {
        SQSSupport.setRegion(region);
        return new SQSSupport(sqs);
    },
    s3Instance: (s3: S3, region?: string) => {
        S3Support.setRegion(region);
        return new S3Support(s3);
    },
};
