import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  categoriasRef: AngularFireList<any>;

  // Linha 14 : Serve para indicar o caminho do banco

  constructor(private db: AngularFireDatabase) {
    this.categoriasRef = this.db.list('categorias/');
  }

  insert(categoria: any) {
    return this.categoriasRef.push(categoria);
  }

  update(categoria: any, key: string) {
    return this.categoriasRef.update(key, categoria);
  }

  getByKey(key: string) {
    const path = 'categorias/' + key;
    return this.db.object(path).snapshotChanges().pipe(
      map(change => {
        return ({ key: change.key, ...change.payload.val() });
      })
    );
  }

  getAll() {
    return this.categoriasRef.snapshotChanges().pipe(
      map(changes => {
        return changes.map(m => ({ key: m.payload.key, ...m.payload.val() }));
      })
    );
  }

  getProdutosByCategoria(key: string) {
    return this.db.list('produtos/', q => q.orderByChild('categoriaKey').equalTo(key))
    .snapshotChanges()
    .pipe(
      map(changes => {
        return changes.map(m => ({ key: m.key }))
      })
    )
  }

  remove(key: string) {
    // return new Promise((resolve, reject) => {
    //   const subscribe = this.getProdutosByCategoria(key).subscribe((produtos: any) => {
    //     subscribe.unsubscribe();

    //     if (produtos.length == 0) {
          return this.categoriasRef.remove(key);
    //     } else {
    //       reject('Não é possível excluir a categoria pois ela tem produtos associados.')
    //     }
    //   });
    // });
    this.categoriasRef.remove(key);

  }

}
