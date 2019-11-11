import { Component, OnInit } from '@angular/core';
import { PopoverController, LoadingController, NavController, AlertController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

	contactData: any = {
		text: 'Some text will come here',
		phone: '9999999999',
		email: 'example@example.com'
	};
	share_app: any;
	userData: any;

  constructor( public popoverController: PopoverController,
              private socialSharing: SocialSharing,
              private browser: InAppBrowser,
              public notifi: NotificationService,
              private platform: Platform,
              private storage: Storage,
  						private loadingCtrl: LoadingController,
  						private navCtrl: NavController,
  						private alert: AlertController,
  						private api: ApiService) {
	}

  ngOnInit() {
  	this.init();
  }

  async init(){
  	this.userData = await this.storage.get('userData');
  	let disclaimer = await this.storage.get('disclaimer');
  	console.log(disclaimer);
  	if(disclaimer.contacts){
  		this.contactData = disclaimer.contacts;
  	}

  	if(disclaimer.share_app){
  		this.share_app = disclaimer.share_app;
  	}
  }

  async onClickVideos(){
  	await this.popoverController.dismiss();
  	this.navCtrl.navigateForward('videos');
  }

	async shareIt(){
		let link = this.platform.is("ios") ? this.share_app.ios : this.share_app.android;
		await this.popoverController.dismiss();
    await this.socialSharing.share(
      "Global Jainism Survey", 
      "Global Jainism Survey", 
      null, 
      link || "http:www.example.com/example.apk");
  }

	async contact(){
		await this.popoverController.dismiss();
		const atr = await this.alert.create({
			header: 'Contacts',
			message: `
				<ion-list>
					<ion-item>
					  <ion-text>`+ this.contactData.text +`</ion-text>
					</ion-item>	

					<ion-item>
					  <ion-icon slot="start" name="call"></ion-icon>
					  <ion-text><a href="tel:`+ this.contactData.phone +`">`+ this.contactData.phone +`</a></ion-text>
					</ion-item>

					<ion-item>
					  <ion-icon slot="start" name="mail"></ion-icon>
					  <ion-text><a href="mailto:`+ this.contactData.email +`">`+ this.contactData.email +`</a></ion-text>
					</ion-item>
				</ion-list>
			`,
			buttons: ['Close'],
			mode: 'ios'
		});

		await atr.present();
	}

	async feedback(){
		await this.popoverController.dismiss();
		let url = this.share_app.feedback + '?id=' + this.userData.email;
		this.browser.create(url, "_system");
	}

	async logout(){
		await this.popoverController.dismiss();
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Wait...'
    });

    loading.present();
    setTimeout(() => {
      this.api.logout().then(res => {
        loading.dismiss();
        if(res){
          this.navCtrl.navigateRoot('/login');
        }
      });
    },2000);
    this.notifi.scheduleLogout('');
  }
}
