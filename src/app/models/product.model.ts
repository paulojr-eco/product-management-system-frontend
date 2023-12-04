import { ProductStore } from "./product-store.model";

export type Product = {
  id: number;
  descricao: string;
  custo: number;
  imagem: Buffer;
  produtoLojas: ProductStore[];
};