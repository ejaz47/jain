import { Component, OnInit, ViewChild } from '@angular/core';
import { BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { IonSlides } from '@ionic/angular';

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

  constructor(private sanitizer: DomSanitizer) { 

  }

  ngOnInit() {
  	this.data = {
  		videoUrl: this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/w6vhJhv4fps'),
  		text: 'A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at A cookie associated with a cross-site resource at http://doubleclick.net/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application'
  	}
  }

  next(){
  	this.slider.slideNext(500);
  }

  onLogin(e){
  	
  }
}
