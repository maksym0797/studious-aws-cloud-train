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

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { productId } = event.pathParameters;
  const client = new Client();
  try {
    await client.connect();
    const productService = new ProductService(new PGProductRepository(client));
    const product = await productService.getProductById(productId);
    await client.end();
    if (!product) {
      return formatErrorJSONResponse(
        404,
        `Product with id ${productId} was not found`
      );
    }
    return formatJSONResponse(product.toJSON());
  } catch (error) {
    return formatErrorJSONResponse(500, error.message);
  }
};

export const main = middyfy(getProductById);
