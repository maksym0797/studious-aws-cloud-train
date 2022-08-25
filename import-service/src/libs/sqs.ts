import {
  GetQueueUrlCommand,
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
// Set the AWS Region.
const REGION = "eu-central-1";
// Create SQS service object.
const sqsClient = new SQSClient({ region: REGION });

const getQueueURL = async (queueName: string): Promise<string> => {
  const data = await sqsClient.send(
    new GetQueueUrlCommand({ QueueName: queueName })
  );

  return data.QueueUrl;
};

export const sendMessage = async (queueName: string, body: string) => {
  const url = await getQueueURL(queueName);
  if (!url || !url?.length) {
    throw new Error(`Queue with name ${queueName} was not found`);
  }
  const data = await sqsClient.send(
    new SendMessageCommand({ QueueUrl: url, MessageBody: body })
  );

  return data;
};
