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
const FUNCTION_NAME = "GET_PRODUCTS_LIST";
export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const client = new Client();
  console.log(FUNCTION_NAME, JSON.stringify(event));
  try {
    await client.connect();
    const productService = new ProductService(new PGProductRepository(client));
    const products = await productService.getAllProducts();
    await client.end();
    const result = products.map((item) => item.toJSON());
    return formatArrayJSONResponse(result);
  } catch (error) {
    console.log(FUNCTION_NAME, error);
    return formatErrorJSONResponse(500, error.message);
  }
};

export const main = middyfy(getProductsList);
