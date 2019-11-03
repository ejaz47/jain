import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

	playingStatus: any = {};

  constructor(public platform: Platform) { 
		this.platform.pause.subscribe(() => {
			this.slideBgAudio.pause();
		});

		this.platform.resume.subscribe(() => {
			if(this.playingStatus['slide_bg']){
				this.slideBgAudio.play();
			}
			if(this.playingStatus['main_bg']){
				this.slideBgAudio.play();
			}
		});
  }

  slideBgAudio: any =  new Audio("assets/audio/slide_bg.mp3");
  mainBgAudio: any =  new Audio("assets/audio/track1.mp3");
	swipeAudio: any =  "assets/audio/question_swipe.mp3";
	clickAudio: any =  "assets/audio/click.mp3";
	completeAudio: any =  "assets/audio/complete.mp3";

	playSlideBg(){
		this.slideBgAudio.loop = true;
  	this.slideBgAudio.volume = 0.2;
    this.slideBgAudio.play();
    this.playingStatus['slide_bg'] = true;
    console.log(this.playingStatus);
	}

	stopSlideBg(){
    this.slideBgAudio.pause();
    this.playingStatus['slide_bg'] = false;
    console.log(this.playingStatus);
	}

	playMainBg(){
		this.mainBgAudio.loop = true;
  	this.mainBgAudio.volume = 0.2;
    this.mainBgAudio.play();
    this.playingStatus['main_bg'] = true;
    console.log(this.playingStatus);
	}

	stopMainBg(){
    this.mainBgAudio.pause();
    this.playingStatus['main_bg'] = false;
    console.log(this.playingStatus);
	}

	play(track){
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
