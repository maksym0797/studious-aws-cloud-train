import Product from "@entities/Product";
import IProductRepository from "./interfaces/IProductRepository";

const productList = require("@mocks/productList.json");

export default class MockProductRepository implements IProductRepository {
  private data: Product[];

  constructor(data: Record<string, any>[] = productList) {
    this.data = data.map(
      (item) => new Product(item.id, item.title, item.description, item.price)
    );
  }
  async createProduct(product: Product): Promise<Product> {
    return product;
  }

  public findAll(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      if (this.data.length > 0) {
        resolve(this.data);
      } else {
        reject("No product data provided");
      }
    });
  }

  public async findById(id: string): Promise<Product | null> {
    const products = await this.findAll();

    const product: Product | undefined = products.find(
      (item: Product) => item.getId() === id
    );

    if (!product) {
      return null;
    }

    return product;
  }
}
