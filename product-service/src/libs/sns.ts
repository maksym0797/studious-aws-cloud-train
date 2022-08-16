import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({ region: "eu-cenral-1" });

export const sendSnsMessage = (message: string) => {
  return snsClient.send(
    new PublishCommand({
      Subject: "Products created",
      TopicArn: process.env.NOTIFICATION_TOPIC_ARN,
      Message: message,
    })
  );
};
