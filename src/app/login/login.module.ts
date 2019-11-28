import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';

import { LoginFormComponent } from './form/form.component';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { loader } from '../services/localize.service';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(loader())
  ],
  declarations: [LoginPage, LoginFormComponent]
})
export class LoginPageModule {}
