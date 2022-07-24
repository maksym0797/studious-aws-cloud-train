import "source-map-support/register";

import {
  formatErrorJSONResponse,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { Client } from "pg";

import schema from "./schema";
import ProductService from "@service/ProductService";
import PGProductRepository from "@repositories/PGProductRepository";
const FUNCTION_NAME = "GET_PRODUCT_BY_ID";
const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { productId } = event.pathParameters;
  console.log(FUNCTION_NAME, "params=", JSON.stringify(event.pathParameters));
  const client = new Client();
  try {
    await client.connect();
    const productService = new ProductService(new PGProductRepository(client));
    const product = await productService.getProductById(productId);
    await client.end();
    if (!product) {
      console.log(FUNCTION_NAME, `Product with id ${productId} was not found`);
      return formatErrorJSONResponse(
        404,
        `Product with id ${productId} was not found`
      );
    }
    return formatJSONResponse(product.toJSON());
  } catch (error) {
    console.log(FUNCTION_NAME, error);
    await client.end();
    return formatErrorJSONResponse(500, error.message);
  }
};

export const main = middyfy(getProductById);
