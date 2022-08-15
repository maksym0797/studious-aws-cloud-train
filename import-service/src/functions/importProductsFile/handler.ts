import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatStringResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getSignedUrlByName } from "@libs/s3";

import schema from "./schema";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { name } = event.pathParameters;
  try {
    const url = await getSignedUrlByName(name);
    return formatStringResponse(url);
  } catch (e) {
    console.log(e);
    return {
      statusCode: 400,
      body: "Sorry, something went wrong",
    };
  }
};

export const main = middyfy(importProductsFile);
