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
import Product from "@entities/Product";
const FUNCTION_NAME = "CREATE_PRODUCT";
const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  console.log(FUNCTION_NAME, "params=", JSON.stringify(event.body));
  const { title, description, price, count } = event.body;
  const client = new Client();
  try {
    await client.connect();
    try {
      const productService = new ProductService(
        new PGProductRepository(client)
      );
      const product = await productService.createProduct(
        new Product("", title, description, price, count)
      );
      if (!product) {
        client.end();
        return formatErrorJSONResponse(400, `Incorrect product data`);
      }
      client.end();
      return formatJSONResponse(product.toJSON());
    } catch (error) {
      console.log(FUNCTION_NAME, error);
      client.end();
      throw error;
    }
  } catch (error) {
    console.log(FUNCTION_NAME, error);
    return formatErrorJSONResponse(500, error.message);
  }
};

export const main = middyfy(createProduct);
