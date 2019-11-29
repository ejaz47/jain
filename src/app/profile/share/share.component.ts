import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {

	share_app: any;
	userData: any;
              
  constructor(private modalCtrl: ModalController,
              private storage: Storage,
              private socialSharing: SocialSharing,
              private platform: Platform) { 
    this.share_app = {};
    this.userData = {};
  }

  ngOnInit() {
    this.init();
  }

  async init(){
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

  async onSubmit(){
  	await this.shareIt();
  }

  async shareIt(){
    let link = this.platform.is("ios") ? this.share_app.ios : this.share_app.android;
    let message = "Use my referral code " + this.userData.referal_code;
    console.log(message, link);
    await this.modalCtrl.dismiss();
    await this.socialSharing.share(
      message, 
      "Global Jainism Survey", 
      null, 
      link || "http://www.example.com/example.apk");
  }
}
