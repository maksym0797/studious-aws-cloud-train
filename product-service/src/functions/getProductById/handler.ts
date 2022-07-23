import "source-map-support/register";

import {
  formatErrorJSONResponse,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import ProductService from "@service/ProductService";
import MockProductRepository from "@repositories/MockProductRepository";

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { productId } = event.pathParameters;
  const productService = new ProductService(new MockProductRepository());
  const product = await productService.getProductById(productId);
  if (!product) {
    return formatErrorJSONResponse(
      404,
      `Product with id ${productId} was not found`
    );
  }
  return formatJSONResponse(product.toJSON());
};

export const main = middyfy(getProductById);
