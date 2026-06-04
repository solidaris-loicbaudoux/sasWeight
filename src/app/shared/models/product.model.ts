export interface ProductResultDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  barcode: string;
  internalCode: string;
  internalPrice: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
}
