import Product from "@entities/Product";
import IProductRepository from "./interfaces/IProductRepository";
import { ClientBase } from "pg";

export default class PGProductRepository implements IProductRepository {
  private client: ClientBase;
  constructor(client: ClientBase) {
    this.client = client;
  }
  async createProduct(product: Product): Promise<Product | null> {
    try {
      await this.client.query("BEGIN");
      const { rows } = await this.client.query(
        `INSERT INTO products (${product
          .getInsertFields()
          .join(",")}) VALUES ($1,$2,$3) RETURNING id`,
        product.toValuesArray()
      );
      if (rows.length <= 0) {
        throw new Error("Unsuccessfull product creation.");
      }
      this.client.query(
        "INSERT INTO stocks (product_id, count) VALUES ($1,$2)",
        [rows[0].id, product.getCount()]
      );
      await this.client.query("COMMIT");
      product.setId(rows[0].id);
      return product;
    } catch (e) {
      await this.client.query("ROLLBACK");
      console.log(e);
    }
    return null;
  }

  async findAll(): Promise<Product[]> {
    const { rows } = await this.client.query(
      "SELECT * from products INNER JOIN stocks ON products.id=stocks.product_id"
    );

    return rows.map(
      (item) =>
        new Product(
          item.id,
          item.title,
          item.description,
          item.price,
          item.count
        )
    );
  }
  async findById(id: string): Promise<Product | null> {
    const { rows } = await this.client.query(
      "SELECT * from products INNER JOIN stocks ON products.id=stocks.product_id WHERE id=$1",
      [id]
    );

    if (rows.length <= 0) {
      return null;
    }

    const item = rows[0];
    return new Product(
      item.id,
      item.title,
      item.description,
      item.price,
      item.count
    );
  }
}
