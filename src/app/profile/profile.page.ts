import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { Animation } from '@ionic/core';
import { IonSlides, LoadingController, NavController, PopoverController, ModalController } from '@ionic/angular';
import { AudioService } from '../services/audio.service';
import { MenuComponent } from './menu/menu.component';
import { NotificationService } from '../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { CongratsComponent } from './congrats/congrats.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  available_languages: any;
  database: any;
  selectedLang: any;
  completedCount: any;
  totalCount: any;
  userProfile: any = {};
  dataVersion: any;
  audoStatus: any;
  constructor(private storage: Storage,
              private popoverController: PopoverController,
              public audio: AudioService,
              public notifi: NotificationService,
  						private loadingCtrl: LoadingController,
  						private navCtrl: NavController,
              private translate: TranslateService,
  						private api: ApiService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
  	// check is looged in
  	this.checkLogin().then(() => {
	  	// check update
	  	this.checkUpdate().then(() => {
        //  update available
		  	this.updateNow().then((database) => {
          this.storage.set('currentVersion', database.versions).then(() => {
            this.dataVersion = database.versions;
          });

          this.database = database;
          this.setup();

		  	});
	  	}).catch((database) => {
        // up to date
	  		console.log('uptodate', database);
        this.database = database;
        this.setup();
	  	});
  	}).catch(() => {
			this.navCtrl.navigateRoot('/login');
  	});
  }

  ionViewWillEnter(){
    if(this.database){
      this.storage.get('database').then((database) => {
        this.database = database;
        this.setup();
      })
    }
  }

  setup(){
    console.log('setup called');
    this.api.syncAnswersInBackground().then(res => {});
    this.storage.get('language').then((lang) => {
      this.available_languages = Object.keys(this.database).filter(item => {
        return (item != 'answers' && item != 'versions') ? item : false
      });
      this.selectedLang = lang || this.available_languages[0];

      this.completedCount = Object.keys(this.database['answers']).length || 0;
      this.totalCount = this.database[this.available_languages[0]]['categories'].length || 0;
      this.audio.getAudioStatus().then(status => {
        this.audoStatus = status;
      });
      // set username
      this.storage.get('gmailData').then((gdata) => {
        this.userProfile = gdata;
      });
      let diff = this.totalCount - this.completedCount;

      if(diff > 0){
        // not completed yet
        this.notifi.schedule(diff + " more badges are waiting, continue survey.");
      }else{
        // completed the survey
        // Show congrats modal 
        this.showCongrats();
      }
    });
  }

  async showCongrats(){
    let modal = await this.modalCtrl.create({
      component: CongratsComponent,
      cssClass: 'congrats-modal',
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });

    modal.present();
  }

  audioToggel(){
    this.audio.toggelStatus().then(status => {
      this.audoStatus = status;
    });
  }

  gotoCategory(){
    this.audio.playMainBg();
    this.navCtrl.navigateForward('/category');
  }

  updateLanguage(lan){
    this.storage.set('language', lan).then(() => {
      console.log(lan);
      this.translate.use(lan);
    });
  }

  async checkUpdate(): Promise<any>{
		const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Getting...'
    });

    loading.present();
  	return new Promise((resolve, reject) => {
  		this.storage.get('currentVersion').then((version) => {
  			this.api.checkUpdate({version: version || 0}).subscribe((resp) => {
          console.log(resp);
  				if(resp.message == 'Update Available'){
						resolve();
  				}else{
            this.storage.get('database').then((database) => {
              reject(database);
            })
  				}
			    loading.dismiss();
  			}, err => {
          // alert('eeeeee');
          this.storage.get('database').then((database) => {
            reject(database);
          })
          loading.dismiss();
        });
  		})
  	});
  }

  async checkLogin(): Promise<any>{
  	return new Promise((resolve, reject) => {
  		this.storage.get('token').then((token) => {
  			if(!token){
  				reject(false);
  			}else{
          this.api.updateHttpOptions(token);
  				resolve(true);
  			}
  		})
  	});
  }

  async updateNow(): Promise<any>{
  	const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Updating...'
    });

    loading.present();
  	return new Promise((resolve, reject) => {
  		this.api.getDatabase().subscribe((resp) => {
  			console.log(resp);
        // resp.answers = {};
        this.storage.set('database', resp).then(() => {
          resolve(resp);
          loading.dismiss();
        });
  		});
  	});
  }

  async openMenu(ev: any){
    const popover = await this.popoverController.create({
      component: MenuComponent,
      event: ev,
      mode: 'md'
    });
    return await popover.present();
  }
}


export function myEnterAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

    wrapperAnimation
        .fromTo('transform', 'scaleX(0.1) scaleY(0.1)', 'translateX(0%) scaleX(1) scaleY(1)')
        .fromTo('opacity', 0, 1);

    backdropAnimation.fromTo('opacity', 0.01, 0.4);

    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(400)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(wrapperAnimation));

}

export function myLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

    const wrapperAnimation = new AnimationC();
    const wrapperEl = baseEl.querySelector('.modal-wrapper');
    wrapperAnimation.addElement(wrapperEl);
    const wrapperElRect = wrapperEl!.getBoundingClientRect();

    wrapperAnimation
      .fromTo('transform', 'scaleX(1) scaleY(1)', 'scaleX(0.1) scaleY(0.1)')
      .fromTo('opacity', 1, 0);

    backdropAnimation.fromTo('opacity', 0.4, 0.0);

    return Promise.resolve(baseAnimation
      .addElement(baseEl)
      .easing('ease-out')
      .duration(400)
      .add(backdropAnimation)
      .add(wrapperAnimation));

}