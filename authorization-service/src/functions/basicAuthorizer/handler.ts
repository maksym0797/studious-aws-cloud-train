import {
  authorizationFailedResult,
  authorizationSuccessResult,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import {
  APIGatewayRequestAuthorizerEventV2,
  APIGatewayRequestSimpleAuthorizerHandlerV2,
} from "aws-lambda";

const basicAuthorizer: APIGatewayRequestSimpleAuthorizerHandlerV2 = async (
  event: APIGatewayRequestAuthorizerEventV2,
  _,
  callback
) => {
  const { headers, routeArn, type } = event;

  const authorizationToken = headers["authorization"];
  if (type !== "REQUEST") {
    console.error(`Unexpected event type: ${type}.`);
    callback && callback("Unauthorized");
    return authorizationFailedResult("", routeArn);
  }
  if (!authorizationToken) {
    callback && callback("Unauthorized");
    return authorizationFailedResult("", routeArn);
  }
  const token = authorizationToken.replace("Basic ", "");

  const [userName, userPassword] = Buffer.from(Buffer.from(token, "base64"))
    .toString("utf-8")
    .split(":");

  const password = process.env[userName];

  if (password === userPassword) {
    return authorizationSuccessResult(token, routeArn);
  }

  return authorizationFailedResult(token, routeArn);
};

export const main = middyfy(basicAuthorizer);
