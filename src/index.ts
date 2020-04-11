import { S3Support } from "./aws/s3-support";
import { SQSSupport } from "./aws/sqs-support";

module.exports = {
    S3 : S3Support,
    SQS : SQSSupport
}

