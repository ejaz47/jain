import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.scss'],
})
export class ThanksComponent implements OnInit {

  category: any;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    this.category = window['selectedCategoryInfo'];
  }

  close(){
  	this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
