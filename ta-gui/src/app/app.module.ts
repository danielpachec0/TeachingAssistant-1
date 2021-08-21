import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MetasComponent } from './metas.component';
import { AlunosComponent } from './alunos.component';
import { AlunoService } from './aluno.service';
import {RoteirosComponent} from "./roteiros.component";
import {RoteirosService} from "./roteiros.service";

@NgModule({
  declarations: [
    AppComponent,
    MetasComponent,
    AlunosComponent,
    RoteirosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'metas',
        component: MetasComponent
      },
      {
        path: 'alunos',
        component: AlunosComponent
      },
      {
        path: 'roteiros',
        component: RoteirosComponent
      }
    ])
  ],
  providers: [AlunoService, RoteirosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
