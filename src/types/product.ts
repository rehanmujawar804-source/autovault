export type Product = {
  id: number;
  name: string;
  sku: string;
  brand: string;
  category: string;
  stock: number;
  buyPrice: number;
  sellPrice: number;
  lowStockThreshold: number;
};