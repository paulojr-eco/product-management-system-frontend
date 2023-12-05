import { ProductStore } from './product-store.model';

export class Product {
  id!: number;
  descricao!: string;
  custo!: number;
  imagem!: Buffer;
  produtoLojas!: ProductStore[];
  constructor() {}
}
