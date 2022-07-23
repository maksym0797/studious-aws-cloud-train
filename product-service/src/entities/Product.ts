export default class Product {
  private id: string;
  private title: string;
  private description: string;
  private price: number;
  constructor(id: string, title: string, description: string, price: number) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
  }
  public getId() {
    return this.id;
  }
  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.price,
    };
  }
}
