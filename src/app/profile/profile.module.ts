import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { MenuComponent } from './menu/menu.component';
import { ShareComponent } from './share/share.component';
import { CongratsComponent } from './congrats/congrats.component';

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
  },
  {
    path: '/share',
    component: ShareComponent
  },
  {
    path: '/congrats',
    component: CongratsComponent
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
  declarations: [ProfilePage, MenuComponent, ShareComponent, CongratsComponent]
})
export class ProfilePageModule {}
