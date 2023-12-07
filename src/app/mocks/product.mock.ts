import { faker } from '@faker-js/faker';

const productId = faker.number.int({ min: 1, max: 9999 });
export const productMock = {
  id: productId,
  descricao: 'any description',
  custo: faker.number.float({
    min: 0,
    max: 9999999999,
    precision: 0.001,
  }),
  imagem: 'any image',
  produtoLojas: [
    {
      id: faker.number.int({ min: 1, max: 9999 }),
      idLoja: faker.number.int({ min: 1, max: 9999 }),
      idProduto: productId,
      precoVenda: faker.number.float({
        min: 0,
        max: 9999999999,
        precision: 0.001,
      }),
    },
  ],
};

export const productMockWithoutDescription = { ...productMock, descricao: '' };

export const productMockWithoutProductStore = { ...productMock, produtoLojas: [] };
