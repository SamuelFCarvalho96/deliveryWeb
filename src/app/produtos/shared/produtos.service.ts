import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) {
    this.produtosRef = this.db.list('produtos/');
  }
  produtosRef: AngularFireList<any>;


  inserir(produto: any) {
    // return this.produtosRef.push(produto);
    return this.save(produto, null);
  }

  Editar(produto: any, key: string) {
    // return this.produtosRef.update(key, produto);
    return this.save(produto, key);
  }

  private save(produto: any, key: string) {
    return new Promise( (resolve, reject) => {
      const produtoRef = {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        categoriaKey: produto.categoriaKey,
        categoriaNome: produto.categoriaNome,
      };

      if (key) {
        this.produtosRef.update(key, produtoRef)
          .then( () => resolve(key) )
          .catch( () => reject() );
      } else {
        this.produtosRef.push(produtoRef)
          .then( (result: any) => resolve(result.key));
      }

    });
  }

  Excluir(key: string, filePath: string) {
    return this.produtosRef.remove(key);
    if (filePath) {
      this.removeImg(filePath, key, false);
    }
  }

  TrazerPelaChave(key: string) {
    const path = 'produtos/' + key;
    return this.db.object(path).snapshotChanges().pipe(
      map(change => {
        return ({ key: change.key, ...change.payload.val() });
      })
    );
  }

  TrazerTudo() {
    return this.produtosRef.snapshotChanges().pipe(
      map(changes => {
        return changes.map(m => ({ key: m.payload.key, ...m.payload.val() }));
      })
    );
  }

  uploadImg(key: string, file: File) {
    const filePath = 'produtos/' + key;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    task.snapshotChanges().pipe(
      finalize( () => {
        ref.getDownloadURL().subscribe(url => {
          this.produtosRef.update(key, {img: url, filePath: filePath });
        });
      })
    ).subscribe();
  }

  removeImg(filePath: string, key: string, atualizarProduto: boolean = true) {
    const ref = this.storage.ref(filePath);
    ref.delete();
    if (atualizarProduto) {
      this.produtosRef.update(key, {img: '', filePath: ''});
    }
  }
}
