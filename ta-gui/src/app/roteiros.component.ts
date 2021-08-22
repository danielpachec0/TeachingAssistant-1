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

  constructor(private roteirosService: RoteirosService) {
  }

  criarRoteiro(r: Roteiro): void {
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
  }

  onMove(): void {
    this.roteiroduplicado = false;
  }

  ngOnInit(): void {
    this.roteirosService.getRoteiros().subscribe(
      rs => {this.roteiros = rs; },
      msg => { alert(msg.message); }
    );
  }
}
