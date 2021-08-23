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

    enviarRelatorio(aluno: Aluno): void {
      this.alunoService.enviarRelatorio(aluno).subscribe(
        (a) => {if (a == null) {
          this.message = 'Erro ao enviar o relatório!';
        } else {
          this.message = 'Relatório enviado com sucesso!';
        }}
      );
    }

    atualizarAluno(aluno: Aluno): void {
      this.alunoService.atualizar(aluno).subscribe(
         (a) => { if (a == null) { alert('Unexpected fatal error trying to update student information! ' +
           'Please contact the systems administratos.');
 } },
         (msg) => { alert(msg.message); }
      );
    }

    onLeave(): void {
      this.showmessage = false;
      this.message = '';
    }

    showMessage(): void {
      this.showmessage = true;
    }

    ngOnInit(): void {
      this.alunoService.getAlunos()
      .subscribe(
         (as) =>  { this.alunos = as; },
         (msg) => { alert(msg.message); }
      );
    }


  }
