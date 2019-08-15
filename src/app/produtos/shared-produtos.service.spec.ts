import { TestBed } from '@angular/core/testing';

import { SharedProdutosService } from './shared-produtos.service';

describe('SharedProdutosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedProdutosService = TestBed.get(SharedProdutosService);
    expect(service).toBeTruthy();
  });
});
