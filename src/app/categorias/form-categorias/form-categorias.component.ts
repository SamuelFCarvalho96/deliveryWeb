import { CategoriasService } from './../shared/categorias.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-categorias',
  templateUrl: './form-categorias.component.html',
  styleUrls: ['./form-categorias.component.css']
})
export class FormCategoriasComponent implements OnInit {
formCategoria: FormGroup;
key: string;

// Linha 18 : Carregar todas as variáveis

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private categoriasService: CategoriasService,
              private toastr: ToastrService,
              private router: Router
                  ) { }

  // Linha 27 : Serve para a primeira ação à se fazer

  ngOnInit() {
    this.criarFormulario();
    this.key = this.route.snapshot.paramMap.get('key');
    if (this.key) {

      // Subscribe significa "escutar" e Unsubscribe significa "pare de escutar"

      const categoriaSubscribe = this.categoriasService.getByKey(this.key).subscribe((categorias: any) => {

   // Linha 36: SetValue é o que mostra na tela

        categoriaSubscribe.unsubscribe();
        this.formCategoria.setValue({nome: categorias.nome, descricao: categorias.descricao});
      });
    }
  }

  get nome() { return this.formCategoria.get('nome'); }
  get descricao () { return this.formCategoria.get('descricao'); }

  // Método de criação de formulário

  criarFormulario() {
    this.key = null;
    this.formCategoria = this.formBuilder.group({
     nome: ['', Validators.required],
     descricao: [''],
    });
  }
  // Linha 57 : Value trás os valores dos campos declarados no Validators (Linha 50)
    onSubmit() {
      if (this.formCategoria.valid) {
        if (this.key) {
          this.categoriasService.update(this.formCategoria.value, this.key);
        } else {
          this.categoriasService.insert(this.formCategoria.value);
        }
         this.router.navigate (['categorias']);
        this.toastr.success('Categoria salva com sucesso!!!');
      }
    }
}
