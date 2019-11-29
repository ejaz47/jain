import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ShareComponent } from '../share/share.component';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.scss'],
})
export class CongratsComponent implements OnInit {

	share_app: any;
  userData: any;
  language: any;
  constructor(private modalCtrl: ModalController,
              private browser: InAppBrowser,
              private storage: Storage) {
    this.share_app = {};
    this.userData = {};
  }

  ngOnInit() {
    this.init();
  }

  async init(){
    this.language = await this.storage.get('language');
    this.userData = await this.storage.get('userData');
    let disclaimer = await this.storage.get('disclaimer');

    if(disclaimer.share_app){
      this.share_app = disclaimer.share_app;
      this.share_app.share_intro = this.share_app.share_intro || '';
    }
  }

  async closeModal(){
  	await this.modalCtrl.dismiss();
  }

  async openShareModal(){
    await this.closeModal();
    let modal = await this.modalCtrl.create({
      component: ShareComponent,
      cssClass: 'share-modal',
    });
    await modal.present();
  }

  async getCertificate(){
    let url = this.share_app.certificate + '?id=' + this.userData.email + '&language=' + this.language;
    console.log(url);
    this.browser.create(url, "_system");
  }
}
