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
      this.alunoService.enviarRelatorio(aluno).subscribe(
        (r) => {
          if (r == null) {
          this.message = 'E-mail ou metas inválidos!';
          this.success = false;
        } else {
          this.message = 'Relatório enviado com sucesso!';
          this.success = true;
        }
          this.showMessage();}
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

    removeMessage(): void {
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
