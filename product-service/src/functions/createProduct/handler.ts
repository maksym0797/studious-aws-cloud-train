import "source-map-support/register";

import {
  formatErrorJSONResponse,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { Pool, PoolClient } from "pg";

import schema from "./schema";
import ProductService from "@service/ProductService";
import PGProductRepository from "@repositories/PGProductRepository";
import Product from "@entities/Product";

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { title, description, price, count } = event.body;
  const pool = new Pool();
  try {
    const client: PoolClient = await pool.connect();
    try {
      const productService = new ProductService(
        new PGProductRepository(client)
      );
      const product = await productService.createProduct(
        new Product("", title, description, price, count)
      );
      if (!product) {
        return formatErrorJSONResponse(400, `Incorrect product data`);
      }
      client.release();
      return formatJSONResponse(product.toJSON());
    } catch (error) {
      console.log("createProduct", JSON.stringify(error));
      client.release();
      throw error;
    }
  } catch (error) {
    return formatErrorJSONResponse(500, error.message);
  }
};

export const main = middyfy(createProduct);
