# aws-sdk-support
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/26baad63fb7f403c889540f9673d19b0)](https://www.codacy.com/gh/techgrid/aws-sdk-support?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=techgrid/aws-sdk-support&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/26baad63fb7f403c889540f9673d19b0)](https://www.codacy.com/gh/techgrid/aws-sdk-support?utm_source=github.com&utm_medium=referral&utm_content=techgrid/aws-sdk-support&utm_campaign=Badge_Coverage)
[![Build Status](https://travis-ci.org/techgrid/aws-sdk-support.svg?branch=master)](https://travis-ci.org/techgrid/aws-sdk-support)
[![NPM](https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&url=https://img.shields.io/npm/l/aws-sdk-support)](https://www.npmjs.com/package/aws-sdk-support)
[![NPM](https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&url=https://img.shields.io/npm/dt/aws-sdk-support)](https://www.npmjs.com/package/aws-sdk-support)
[![NPM](https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&url=https://img.shields.io/npm/v/aws-sdk-support)](https://www.npmjs.com/package/aws-sdk-support)
[![David](https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&url=https://img.shields.io/david/techgrid/aws-sdk-support)](https://david-dm.org/techgrid/aws-sdk-support)
[![David](https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&url=https://img.shields.io/david/dev/techgrid/aws-sdk-support)](https://david-dm.org/techgrid/aws-sdk-support?type=dev)

AWS SDK wrapper for node

This library provides a simple wrapper on for aws-sdk
Current version only supports following services
* S3
    * Get Object Content
    * Delete Object
* SQS
    * Send Message

### S3
* Creating Client Instance
```js
const s3 = new S3Client();
``` 
or
```js
const awsS3 = new S3();
const s3 = new S3Client(awsS3);
``` 

To set an AWS region (if not available via environment variables)
```js
S3Client.setRegion('us-east-1');
```

* Getting Object Content
```js
const content = await s3.getObjectContent('bucket', 'object/key.txt');
```

* Deleting Object
```js
const result = await s3.deleteObject('bucket', 'object/key.txt');
```

### SQS
* Creating Client Instance
```js
const sqs = new SqsClient();
``` 
or
```js
const awsSqs = new SQS();
const sqs = new SqsClient(awsSqs);
``` 

To set an AWS region (if not available via environment variables)
```js
SqsClient.setRegion('us-east-1');
```

* Sending Message
```js
const content = await sqs.sendMessage('queue', {'message': 'this is message'});
```
