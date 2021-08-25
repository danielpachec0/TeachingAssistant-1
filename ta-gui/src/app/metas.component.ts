import { Component, OnInit } from '@angular/core';

import { Aluno } from '../../../common/aluno';
import { AlunoService } from './aluno.service';

  @Component({
   selector: 'metas',
   templateUrl: './metas.component.html',
   styleUrls: ['./metas.component.css']
 })
 export class MetasComponent implements OnInit {
    constructor(private alunoService: AlunoService) {}

    alunos: Aluno[];
    public message = '';
    public showmessage = false;
    public success = false;

    enviarRelatorio(aluno: Aluno): void {
      if (!this.invalidMetas(aluno)) {
        this.alunoService.enviarRelatorio(aluno.cpf).subscribe(
          (r) => {
            if (r == null) {
              this.message = 'E-mail inválido!';
              this.success = false;
            } else {
              this.message = 'Relatório enviado com sucesso!';
              this.success = true;
              this.updateAlunos();
            }
          }
        );
      } else {
        this.message = 'Metas inválidas!';
      }
      this.showMessage();
    }

    atualizarAluno(aluno: Aluno): void {
      aluno.relatorioEnviado = false;
      this.alunoService.atualizar(aluno).subscribe(
         (a) => { if (a == null) { alert('Unexpected fatal error trying to update student information! ' +
           'Please contact the systems administratos.');
 } },
         (msg) => { alert(msg.message); }
      );
    }

    removeMessage(): void {
      this.showmessage = false;
      this.message = '';
    }

    showMessage(): void {
      this.showmessage = true;
    }

    updateAlunos(): void {
      this.alunoService.getAlunos()
        .subscribe(
          (as) =>  { this.alunos = as; },
          (msg) => { alert(msg.message); }
        );
    }

    invalidMetas(aluno: Aluno): boolean{
      for (const key in aluno.metas) {
        if (isNaN(aluno.metas[key]) || aluno.metas[key] < 0 || aluno.metas[key] > 10) {
          return true;
        }
      }
      return false;
    }

    ngOnInit(): void {
      this.alunoService.getAlunos()
      .subscribe(
         (as) =>  { this.alunos = as; },
         (msg) => { alert(msg.message); }
      );
    }


  }
