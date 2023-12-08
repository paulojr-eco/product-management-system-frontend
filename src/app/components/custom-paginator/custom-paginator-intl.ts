import { MatPaginatorIntl } from '@angular/material/paginator';

export class CustomPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();

    this.getAndInitTranslations();
  }
  getAndInitTranslations() {
    this.itemsPerPageLabel = 'Itens por página';
    this.nextPageLabel = 'Próxima página';
    this.previousPageLabel = 'Página anterior';
    this.lastPageLabel = 'Última página';
    this.firstPageLabel = 'Primeira página';
    this.changes.next();
  }
}
