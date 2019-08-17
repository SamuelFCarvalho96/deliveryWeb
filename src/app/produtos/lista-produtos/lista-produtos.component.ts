import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../shared/produtos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.css']
})
export class ListaProdutosComponent implements OnInit {
  produtos: Observable<any[]>;
  ProdutosService: any;

  constructor(private produtosService: ProdutosService, private toastr: ToastrService) { }

  ngOnInit() {
    this.produtos = this.produtosService.TrazerTudo();
  }

  remover(key: string) {
    this.produtosService.Excluir(key)
    .catch((mensagem: string) => {
     this.toastr.error(mensagem);
    });
  }
}
