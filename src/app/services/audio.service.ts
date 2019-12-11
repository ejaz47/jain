import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

	playingStatus: any = {};
	foreground: boolean = true;
	private audioStatus: boolean = true;

  constructor(public platform: Platform, public storage: Storage) { 

  	document.addEventListener("pause", () => {
  		this.foreground = false;
  		console.log('cordova paused');
			this.slideBgAudio.pause();
			this.mainBgAudio.pause();
  	}, false);

		document.addEventListener("resume", () => {
  		this.foreground = true;
			if(this.playingStatus['slide_bg']){
				this.playSlideBg();
			}else if(this.playingStatus['main_bg']){
				this.playMainBg();
			}
			console.log('app resumed');
		}, false);
  }
  
  setAudioStatus(status){
  	this.audioStatus = status;
  }

  getAudioStatus(): Promise<any>{
  	return new Promise((resolve, reject) => {
  		this.storage.get('audioStatus').then(status => {
	  			if(status == null || status == undefined){
	  				status = true;	
	  			}
  				resolve(status);
  				this.audioStatus = status;
   		});
  	});
  }

  toggelStatus(): Promise<any>{
  	return new Promise((resolve, reject) => {
  		this.storage.get('audioStatus').then(status => {
  			status = !status;
  			this.storage.set('audioStatus', status).then(() => {
  				resolve(status);
  				this.audioStatus = status;
  			});
  		});
  	});
  }

  slideBgAudio: any =  new Audio("assets/audio/slide_bg.mp3");
  mainBgAudio: any =  new Audio("assets/audio/track1.mp3");
	swipeAudio: any =  "assets/audio/question_swipe.mp3";
	clickAudio: any =  "assets/audio/click.mp3";
	completeAudio: any =  "assets/audio/complete.mp3";

	playSlideBg(){
		if(this.audioStatus){
			if(this.foreground){
				setTimeout(() => {
					this.slideBgAudio.loop = true;
			  	this.slideBgAudio.volume = 0.2;
			    this.slideBgAudio.play();
			    this.playingStatus['slide_bg'] = true;
			    console.log(this.playingStatus);
				}, 500);
			}else{
				this.playingStatus['slide_bg'] = true;
			}
		}
	}

	stopSlideBg(){
		if(this.audioStatus){
	    this.slideBgAudio.pause();
	    this.playingStatus['slide_bg'] = false;
	    console.log(this.playingStatus);
		}
	}

	playMainBg(){
		if(this.audioStatus){
			if(this.foreground){
				setTimeout(() => {
					this.mainBgAudio.loop = true;
					this.mainBgAudio.volume = 0.2;
				  this.mainBgAudio.play();
				  this.playingStatus['main_bg'] = true;
				  console.log(this.playingStatus);
				});
			}else{
			  this.playingStatus['main_bg'] = true;
			}
		}
	}

	stopMainBg(){
		if(this.audioStatus){
	    this.mainBgAudio.pause();
	    this.playingStatus['main_bg'] = false;
	    console.log(this.playingStatus);
	  }
	}

	play(track){
		if(this.audioStatus){
			switch (track) {
				case "swipe":{
						let t = new Audio(this.swipeAudio);
						t.play();
						break;
				}
				case "click":{
						let t = new Audio(this.clickAudio);
						t.play();
						break;
				}
				case "complete": {
						let t = new Audio(this.completeAudio);
						t.play();
				}
				default:
					// code...
					break;
			}
		}
	}
}
