import { Component, OnInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {

	data: any;
	hasError: boolean = false;

  constructor(private sanitizer: DomSanitizer,
  						private navCtrl: NavController,
  						private api: ApiService) { }

  ngOnInit() {

  }

  ionViewWillEnter(){
  	this.data = undefined;
  	this.api.getVideos().subscribe(resp => {
  		console.log(resp);
  		if(resp.Success){
	  		this.data = resp.data.map(item => {
	  			item.url = this.sanitizer.bypassSecurityTrustResourceUrl(item.url);
	  			return item;
	  		});
	  		this.hasError = false;
  		}
  	}, err => {
  		this.data = [];
  		this.hasError = true;
  		console.log(err);
  	});
  }

  goback(){
  	this.navCtrl.back();
  }
}
