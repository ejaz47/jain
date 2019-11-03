import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ThanksComponent } from './thanks.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [ThanksComponent],
  exports: [
  	ThanksComponent
  ]
})
export class ThanksModule {}
