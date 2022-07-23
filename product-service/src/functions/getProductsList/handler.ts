import "source-map-support/register";

import {
  formatArrayJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import ProductService from "@service/ProductService";
import MockProductRepository from "@repositories/MockProductRepository";

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  const productService = new ProductService(new MockProductRepository());
  const products = await productService.getAllProducts();
  const result = products.map((item) => item.toJSON());
  return formatArrayJSONResponse(result);
};

export const main = middyfy(getProductsList);
