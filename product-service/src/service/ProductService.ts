import Product from "@entities/Product";
import IProductRepository from "@repositories/interfaces/IProductRepository";

export default class ProductService {
  private productRepository: IProductRepository;
  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  public getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  public getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  public createProduct(product: Product): Promise<Product | null> {
    return this.productRepository.createProduct(product);
  }
}
