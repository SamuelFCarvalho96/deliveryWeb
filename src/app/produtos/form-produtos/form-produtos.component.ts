import { ToastrService } from 'ngx-toastr';
import { ProdutosService } from './../shared/produtos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-produtos',
  templateUrl: './form-produtos.component.html',
  styleUrls: ['./form-produtos.component.css']
})
export class FormProdutosComponent implements OnInit {

  formProduto: FormGroup;
  key: string;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private produtosService: ProdutosService,
              private toastr: ToastrService,
              private router: Router
                  ) { }
  ngOnInit() {
    this.criarFormulario();
    this.key = this.route.snapshot.paramMap.get('key');
    if (this.key) {
      const produtoSubscribe = this.produtosService.TrazerPelaChave(this.key).subscribe((produtos: any) => {

        produtoSubscribe.unsubscribe();
        this.formProduto.setValue({nome: produtos.nome, descricao: produtos.descricao, preco: produtos.preco});
      });
     }
  }

  get nome() { return this.formProduto.get('nome'); }
  get descricao () { return this.formProduto.get('descricao'); }
  get preco () { return this.formProduto.get('preco'); }

  criarFormulario() {
    this.key = null;
    this.formProduto = this.formBuilder.group({
     nome: ['', Validators.required],
     descricao: [''],
     preco: [''],
    });
  }
  onSubmit() {
    if (this.formProduto.valid) {
      if (this.key) {
        this.produtosService.Editar(this.formProduto.value, this.key);
      } else {
        this.produtosService.inserir(this.formProduto.value);
      }
       this.router.navigate (['produtos']);
      this.toastr.success('Produto salvo com sucesso!!!');
    }
  }


}
