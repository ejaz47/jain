import { Component, OnInit, ViewChild } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { IonSlides, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	data: any;
	@ViewChild('slider', {static: false}) slider: IonSlides;

	slideOpts = {
		slidesPerView: 1,
		touchRatio: 0,
	}

  constructor(private sanitizer: DomSanitizer, 
              private loadingCtrl: LoadingController, 
              private api: ApiService, 
              private storage: Storage,
              private navCtrl: NavController) { 

  }

  ngOnInit() {
    // get data from server
  	this.data = {
  		videoUrl: this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/w6vhJhv4fps'),
  		text: 'A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at http://doubleclick.net/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application'
  	}
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
            this.navCtrl.navigateRoot('/category');
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
    this.api.getUserDetails({ gmail_id: 'ejaz.portal@gmail.com'})
      .subscribe((data) => {
        console.log(data);
        loading.dismiss();

        // save token
        if(data.data.token){
          this.storage.set('gmailData', data.data);
        }

        // and move forward
        this.next();
    })

  }
}
