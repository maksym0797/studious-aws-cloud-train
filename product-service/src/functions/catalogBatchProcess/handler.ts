import { middyfy } from "@libs/lambda";
import { SQSEvent, SQSHandler, SQSRecord } from "aws-lambda";
import Product from "@entities/Product";
import { Client } from "pg";
import ProductService from "@service/ProductService";
import PGProductRepository from "@repositories/PGProductRepository";
import { sendSnsMessage } from "@libs/sns";

const catalogBatchProcess: SQSHandler = async (
  event: SQSEvent
): Promise<void> => {
  const products: SQSRecord[] = event.Records;
  const client = new Client();
  try {
    await client.connect();
    const productService = new ProductService(new PGProductRepository(client));
    const createdProducts = [];
    for (const product of products) {
      createdProducts.push(
        await productService.createProduct(JSON.parse(product.body) as Product)
      );
    }
    sendSnsMessage(
      `Products with ids ${createdProducts
        .map((p) => p.id)
        .join(",")} were created.`
    );
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
};

export const main = middyfy(catalogBatchProcess);
