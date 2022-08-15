import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatStringResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { uploadToS3 } from "@libs/s3";

import schema from "./schema";

const importFileParser: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    await uploadToS3();
    return formatStringResponse("");
  } catch (e) {
    console.log(e);
    return {
      statusCode: 400,
      body: "Sorry, something went wrong",
    };
  }
};

export const main = middyfy(importFileParser);
