import { middyfy } from "@libs/lambda";
import { parseUploaded } from "@libs/s3";
import { sendMessage } from "@libs/sqs";
import { S3Event, S3Handler } from "aws-lambda";

const importFileParser: S3Handler = async (event: S3Event) => {
  try {
    const data = await parseUploaded();
    for (const prasedProduct of data) {
      sendMessage("catalogItemsQueue", JSON.stringify(prasedProduct));
    }
  } catch (e) {
    console.log(e);
  }
};

export const main = middyfy(importFileParser);
