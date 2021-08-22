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
    private message = '';
    private showmessage = false;

    enviarRelatorio(aluno: Aluno): void {
      this.alunoService.enviarRelatorio(aluno).subscribe(
        (a) => {if (a == null) {
          this.message = 'Relatório enviado com sucesso!';
        } else {
          this.message = 'Erro ao enviar o relatório!';
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

    onMove(): void {
      this.showmessage = false;
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
