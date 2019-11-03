import { Component, OnInit, ViewChild } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { IonSlides, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	data: any = {};
	@ViewChild('slider', {static: false}) slider: IonSlides;

	slideOpts = {
		slidesPerView: 1,
		touchRatio: 0,
	}

  constructor(private sanitizer: DomSanitizer, 
              private loadingCtrl: LoadingController, 
              private api: ApiService, 
              private storage: Storage,
              private googlePlus: GooglePlus,
              private navCtrl: NavController) { 

  }

  ngOnInit() {
  }

  next(){
  	this.slider.slideNext(500);
  }

  async onLogin(formData){
    if(formData){
      const loading = await this.loadingCtrl.create({
        mode: 'ios',
        message: 'Getting...'
      });
      loading.present();

      // submit data to server
      this.storage.get('gmailData').then((gmailData) => {

        let data = {
          userdata: formData,
          gmaildata: gmailData
        }
        console.log(data);
        this.api.sendUserData(data).subscribe((resp) => {
          loading.dismiss();
          if(resp.success){
            this.navCtrl.navigateRoot('/profile');
          }
        });
      })
    }
  }

  goback(){
    this.slider.slidePrev(500);
  }

  async gmailClick(){
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Getting...'
    });
    loading.present();

    if(!window.cordova){
      this.getData(loading, {email: 'ejaz.portal@gmail.com'});
      return true;
    }

    this.googlePlus.login({
      'webClientId': '641509421493-soqs963bk4ed3fiau4onnoqlbdl926s0.apps.googleusercontent.com',
      'offline': true
    }).then( res => {
      this.getData(loading, res);
    })
    .catch(err => {
      console.log(err);
      alert('Please Allow us and Make sure internet connection is on!');
      loading.dismiss();
    });
  }

  getData(loading, gmailData){
    this.api.getUserDetails({ email: gmailData.email })
    .subscribe((data) => {
        console.log(data);

        // save token
        if(data.success){
          this.storage.set('userData', data.data).then(() => {
            this.storage.set('token', data.token).then(() => {
              this.storage.set('gmailData', gmailData).then(() => {
                
                this.storage.set('disclaimer', 
                {
                    video: data.video, 
                    text: data.disclaimer
                })
                .then(() => {
                  loading.dismiss();
                });

              });
            });  
          });
        }

        // get data from server
        this.data = {
          videoUrl: this.sanitizer.bypassSecurityTrustResourceUrl(data.video),
          text: data.disclaimer
        };

        // and move forward
        this.next();
    }, (error) => {
      alert('Make sure internet connection is on!');
      loading.dismiss();
    });
  }
}
