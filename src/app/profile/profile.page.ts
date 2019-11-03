import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { IonSlides, LoadingController, NavController } from '@ionic/angular';

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

  constructor(private storage: Storage,
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

  setup(){
    this.storage.get('language').then((lang) => {
      this.available_languages = Object.keys(this.database);
      this.selectedLang = lang || this.available_languages[0];
    });

    this.completedCount = Object.keys(this.database['answers']).length || 0;
    this.totalCount = this.database['english']['categories'].length || 0;
  }

  gotoCategory(){
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
  				if(resp.isAvailable){
  					this.storage.set('currentVersion', parseInt(resp.version)).then(() => {
  						resolve();
  					});
  				}else{
            this.storage.get('database').then((database) => {
              reject(database);
            })
  				}
			    loading.dismiss();
  			})
  		})
  	});
  }

  async checkLogin(): Promise<any>{
  	return new Promise((resolve, reject) => {
  		this.storage.get('gmailData').then((gdata) => {
  			if(!gdata){
  				reject(false);
  			}else{
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
        this.storage.set('database', resp).then(() => {
          resolve(resp);
          loading.dismiss();
        });
  		});
  	});
  }
}
