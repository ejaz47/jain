import { Component, OnInit, ViewChild } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { IonSlides, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoginFormComponent } from './form/form.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	data: any = {};
  @ViewChild('slider', {static: false}) slider: IonSlides;
	@ViewChild('myform', {static: false}) myForm: LoginFormComponent;

  selectedLang: any;
	slideOpts = {
		slidesPerView: 1,
		touchRatio: 0,
	}

  constructor(private sanitizer: DomSanitizer, 
              private loadingCtrl: LoadingController, 
              private api: ApiService, 
              private storage: Storage,
              private translate: TranslateService,
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
          if(resp.Success || resp.success){
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
      // mock sample data
      let gdata = {
        displayName: "Ejaz Ansari",
        email: "vjjadhav9@gmail.com",
        // email: "ejaz.portal@gmail.com",
        expires: 1572786573,
        expires_in: 3576,
        familyName: "Ansari",
        givenName: "Ejaz",
        imageUrl: ''
      }
      this.getData(loading, gdata);
      return true;
    }

    this.googlePlus.login({
      'webClientId': '1086853467587-np8epl1fhq8qfh4p5jsn9gms04954blv.apps.googleusercontent.com',
      'offline': true
    }).then( res => {
      console.log(res);
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
          this.myForm.myForm.setValue({
            age: parseInt(data.data.age) || '',
            gender: data.data.gender || '',
            religion: data.data.religion || '',
            country: data.data.country || '',
            state: data.data.state || '',
            city: data.data.city || '',
            contact: data.data.contact || '',
            sampraday: data.data.sampraday || '',
            qualification: data.data.qualification || '',
            refered_by: data.data.refered_by || ''
          });
          this.storage.set('userData', data.data).then(() => {
            this.storage.set('token', data.token).then(() => {
              this.api.updateHttpOptions(data.token);
              this.storage.set('gmailData', gmailData).then(() => {
                
                this.storage.set('disclaimer', data.disclaimer).then(() => {
                  loading.dismiss();
                });

              });
            });  
          });
        }

        // get data from server
        this.data = {
          videoUrl: this.sanitizer.bypassSecurityTrustResourceUrl(data.disclaimer.video),
          text: data.disclaimer.text
        };

        // and move forward
        this.next();
    }, (error) => {
      alert('Make sure internet connection is on!');
      loading.dismiss();
    });
  }

  updateLanguage(lan){
    console.log(lan);
    this.storage.set('language', lan).then(() => {
      console.log(lan);
      this.translate.use(lan);
    });
  }
}
