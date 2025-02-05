import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, map } from 'rxjs/operators';

import {Roteiro} from '../../../common/roteiro';

@Injectable()
export class RoteirosService {

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private taURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  criar(roteiro: Roteiro): Observable<Roteiro> {
    return this.http.post<any>(this.taURL + '/roteiro', roteiro, {headers: this.headers})
      .pipe(
        retry(2),
        map( res => {if (res.success) {return roteiro; } else {return null; }} )
      );
  }

  atualizar(roteiro: Roteiro): Observable<Roteiro> {
    return this.http.put<any>(this.taURL + '/roteiro' , JSON.stringify(roteiro), {headers: this.headers}).pipe(
      retry(2),
      map( res => {if (res.success) {return roteiro; } else {return null; }} )
    );
  }

  deletar(nome: string): Observable<string> {
    const body = {nome: nome};
    return this.http.request<any>('delete', this.taURL + '/roteiro', {headers: this.headers, body}).pipe(
      retry(2),
      map( res => {if (res.success) {return nome; } else {return null; }})
    );
  }

  getRoteiros(): Observable<Roteiro[]> {
    return this.http.get<Roteiro[]>(this.taURL + '/roteiro')
      .pipe(
        retry(2)
      );
  }

}
