import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.scss'],
})
export class ThanksComponent implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {}

  close(){
  	this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
