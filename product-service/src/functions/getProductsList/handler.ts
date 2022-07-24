import "source-map-support/register";

import {
  formatArrayJSONResponse,
  formatErrorJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { Client } from "pg";

import schema from "./schema";
import ProductService from "@service/ProductService";
import PGProductRepository from "@repositories/PGProductRepository";

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  const client = new Client();
  try {
    await client.connect();
    const productService = new ProductService(new PGProductRepository(client));
    const products = await productService.getAllProducts();
    await client.end();
    const result = products.map((item) => item.toJSON());
    return formatArrayJSONResponse(result);
  } catch (error) {
    return formatErrorJSONResponse(500, error.message);
  }
};

export const main = middyfy(getProductsList);
