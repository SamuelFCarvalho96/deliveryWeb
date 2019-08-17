import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  produtosRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this.produtosRef = this.db.list('produtos/');
  }

  inserir(produto: any) {
    return this.produtosRef.push(produto);
  }

  Editar(produto: any, key: string) {
    return this.produtosRef.update(key, produto);
  }

  Excluir(key: string) {
    return this.produtosRef.remove(key);
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
}
