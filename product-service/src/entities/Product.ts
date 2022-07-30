export default class Product {
  private id: string;
  private title: string;
  private description: string;
  private price: number;
  private count: number;
  constructor(
    id: string,
    title: string,
    description: string,
    price: number,
    count: number = 0
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.count = count;
  }
  public setId(id: string) {
    this.id = id;
  }
  public getId() {
    return this.id;
  }
  public getCount() {
    return this.count;
  }
  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.price,
      count: this.count,
    };
  }
  public getInsertFields(): Array<string> {
    return ["title", "description", "price"];
  }
  public toValuesArray(): Array<string> {
    return [this.title, this.description, this.price.toString()];
  }
}
