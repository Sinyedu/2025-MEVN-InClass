export type Product = {
  _id: string;
  name: string;
  description: string;
  imageURL: string;
  price: number;
  stock: number;
  discount: boolean;
  discountPct: number;
  isHidden: boolean;
  _createdBy: string;
};
//Omit removes a specified object, parameter. Whatever you call it, so I remove the _id
export type newProduct = Omit<Product, "_id"> &
  Partial<Pick<Product, "_createdBy">>;
