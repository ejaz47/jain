import { Component, OnInit } from '@angular/core';
import { PopoverController, LoadingController, NavController, AlertController, Platform, ModalController} from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NotificationService } from '../../services/notification.service';
import { ShareComponent } from '../share/share.component';

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
              private browser: InAppBrowser,
              public notifi: NotificationService,
              private platform: Platform,
              private storage: Storage,
  						private loadingCtrl: LoadingController,
  						private navCtrl: NavController,
  						private alert: AlertController,
              private modalCtrl: ModalController,
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

  async openShareModal(){
    let modal = await this.modalCtrl.create({
      component: ShareComponent,
      cssClass: 'share-modal',
    });
    await modal.present();
    await this.popoverController.dismiss();
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
