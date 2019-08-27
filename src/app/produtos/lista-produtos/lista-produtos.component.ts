import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../shared/produtos.service';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.css']
})
export class ListaProdutosComponent implements OnInit {
  produtos: Observable<any[]>;
  produtoService: any;

  constructor(private produtosService: ProdutosService ) { }

  ngOnInit() {
    this.produtos = this.produtosService.TrazerTudo();
  }

  remover(key: string, filePath: string) {
    this.produtosService.Excluir (key, filePath);
  }
}
