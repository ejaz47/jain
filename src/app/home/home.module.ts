import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ThanksComponent } from './thanks/thanks.component';
import { ThanksModule } from './thanks/thanks.module';

@NgModule({
  entryComponents: [ThanksComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    ThanksModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
