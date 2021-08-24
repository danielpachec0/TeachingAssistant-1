import { Component, OnInit } from '@angular/core';
import {Roteiro} from '../../../common/roteiro';
import {RoteirosService} from './roteiros.service';

@Component({
  selector: 'app-roteiros',
  templateUrl: './roteiros.component.html',
  styleUrls: ['./roteiros.component.css']
})

export class RoteirosComponent implements OnInit {

  roteiro: Roteiro = new Roteiro();
  roteiros: Roteiro[] = [];
  roteiroduplicado = false;
  success = false;
  showmessage = false;

  constructor(private roteirosService: RoteirosService) {
  }

  criarRoteiro(r: Roteiro): void {
    if (!this.dataInvalida(r.dataDeEntrega)) {
      this.roteirosService.criar(r.clone()).subscribe(
        rr => {
          if (rr) {
            this.roteiros.push(rr);
            this.roteiro = new Roteiro();
          } else {
            this.roteiroduplicado = true;
          }},
        msg => {alert(msg.message); }
      );
    } else {
      this.showmessage = true;
    }

  }

  removeRoteiro(roteiro: Roteiro): void {
    this.roteirosService.deletar(roteiro.nome).subscribe(
      rr => {
        if (rr) {
          let index = 0;
          for (const r of this.roteiros) {
            if (r.nome === rr) {
              index = this.roteiros.indexOf(r);
            }
          }
          this.roteiros.splice(index, 1);
        }
      }, msg => {alert(msg.message); }
    );
  }

  dataInvalida(data: string): boolean {
     return (Date.parse(data) < Date.now());
  }



  removeMessage(): void {
    this.showmessage = false;
  }

  onFocusOut(): void {
    this.roteiroduplicado = false;
  }

  ngOnInit(): void {
    this.roteirosService.getRoteiros().subscribe(
      rs => {this.roteiros = rs; },
      msg => { alert(msg.message); }
    );
  }
}
