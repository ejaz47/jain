import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { IonSlides, LoadingController, NavController } from '@ionic/angular';
import { AudioService } from '../services/audio.service';

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
              public audio: AudioService,
  						private loadingCtrl: LoadingController,
  						private navCtrl: NavController,
  						private api: ApiService) { }

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
    });
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
  				if(resp.message == 'Update Available' || true){
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

  async logout(){
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
  }
}
