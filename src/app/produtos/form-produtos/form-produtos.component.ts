import { CategoriasService } from './../../categorias/shared/categorias.service';
import { ToastrService } from 'ngx-toastr';
import { ProdutosService } from './../shared/produtos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-produtos',
  templateUrl: './form-produtos.component.html',
  styleUrls: ['./form-produtos.component.css']
})
export class FormProdutosComponent implements OnInit {

  formProduto: FormGroup;
  key: string;
  categorias: Observable<any[]>;

  private file: File = null;
  imgUrl = '';
  filePath = '';

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private categoriasService: CategoriasService,
              private produtosService: ProdutosService,
              private toastr: ToastrService,
              private router: Router
                  ) { }
  ngOnInit() {
    this.criarFormulario();
    this.categorias = this.categoriasService.getAll();

    this.key = this.route.snapshot.paramMap.get('key');
    if (this.key) {
      const subscribe = this.produtosService.TrazerPelaChave(this.key).subscribe((produtos: any) => {

        subscribe.unsubscribe();
        this.formProduto.setValue({nome: produtos.nome,
            descricao: produtos.descricao,
            preco: produtos.preco,
            categoriaKey: produtos.categoriaKey,
            categoriaNome: produtos.categoriaNome
          });

      this.imgUrl = produtos.img || '';
      this.filePath = produtos.filePath || '';
        });
     }
  }

  get nome() { return this.formProduto.get('nome'); }
  get descricao () { return this.formProduto.get('descricao'); }
  get categoriaKey() { return this.formProduto.get('categoriaKey'); }
  get categoriaNome() { return this.formProduto.get('categoriaNome'); }

  criarFormulario() {
    this.key = null;
    this.formProduto = this.formBuilder.group({
     nome: ['', Validators.required],
     descricao: [''],
     preco: [''],
     categoriaKey: ['', Validators.required],
     categoriaNome: [''],
     img: ['']
    });

    this.file = null;
    this.imgUrl = '';
    this.filePath = '';
  }

  setCategoriaNome(categoria: any) {
    if (this.categorias && this.formProduto.value.categoriaKey) {
      const categoriaNome = this.categorias[0].text;
      this.categoriaNome.setValue(categoriaNome);
    } else {
      this.categoriaNome.setValue('');
    }
  }

  upload(event: any) {
    if (event.target.files.length) {
      this.file = event.target.files[0];
    } else {
      this.file = null;
    }
  }

  removeImg() {
    this.produtosService.removeImg(this.filePath, this.key);
    this.imgUrl = '';
    this.filePath = '';
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
