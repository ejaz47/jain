import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { MenuComponent } from './menu/menu.component';

import { TranslateModule } from '@ngx-translate/core';
import { loader } from '../services/localize.service';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: '/menu',
    component: MenuComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(loader())
  ],
  declarations: [ProfilePage, MenuComponent]
})
export class ProfilePageModule {}
