import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const formatErrorJSONResponse = (errorCode: number, message: string) => {
  return {
    statusCode: errorCode,
    body: message,
  };
};

export const formatArrayJSONResponse = (
  response: Record<string, unknown>[]
) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
