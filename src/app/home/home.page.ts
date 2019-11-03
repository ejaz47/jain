import { Component,ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { ToastController, NavController, AlertController, ModalController } from '@ionic/angular';
import { ThanksComponent } from './thanks/thanks.component';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('elementState', [
      state('opaque', style({
        opacity: 1
      })),
      state('transparent', style({
        opacity: 0
      })),
      transition('opaque => transparent', animate('400ms ease-in')),
      transition('transparent => opaque', animate('400ms ease-out'))
    ])
  ],
})
export class HomePage {

	@ViewChild('slider', {static: false}) slider: any;
  state = "transparent";

	slideOpts = {
		slidesPerView: 1,
		touchRatio: 0,
	  coverflowEffect: {
	    rotate: 50,
	    stretch: 0,
	    depth: 100,
	    modifier: 1,
	    slideShadows: true,
	  },
	  on: {
	    beforeInit() {
	      const swiper = this;

	      swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
	      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

	      swiper.params.watchSlidesProgress = true;
	      swiper.originalParams.watchSlidesProgress = true;
	    },
	    setTranslate() {
	      const swiper = this;
	      const {
	        width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
	      } = swiper;
	      const params = swiper.params.coverflowEffect;
	      const isHorizontal = swiper.isHorizontal();
	      const transform$$1 = swiper.translate;
	      const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
	      const rotate = isHorizontal ? params.rotate : -params.rotate;
	      const translate = params.depth;
	      // Each slide offset from center
	      for (let i = 0, length = slides.length; i < length; i += 1) {
	        const $slideEl = slides.eq(i);
	        const slideSize = slidesSizesGrid[i];
	        const slideOffset = $slideEl[0].swiperSlideOffset;
	        const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;

	         let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
	        let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
	        // var rotateZ = 0
	        let translateZ = -translate * Math.abs(offsetMultiplier);

	         let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
	        let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;

	         // Fix for ultra small values
	        if (Math.abs(translateX) < 0.001) translateX = 0;
	        if (Math.abs(translateY) < 0.001) translateY = 0;
	        if (Math.abs(translateZ) < 0.001) translateZ = 0;
	        if (Math.abs(rotateY) < 0.001) rotateY = 0;
	        if (Math.abs(rotateX) < 0.001) rotateX = 0;

	         const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

	         $slideEl.transform(slideTransform);
	        $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
	        if (params.slideShadows) {
	          // Set shadows
	          let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
	          let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
	          if ($shadowBeforeEl.length === 0) {
	            $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
	            $slideEl.append($shadowBeforeEl);
	          }
	          if ($shadowAfterEl.length === 0) {
	            $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
	            $slideEl.append($shadowAfterEl);
	          }
	          if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
	          if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
	        }
	      }

	       // Set correct perspective for IE10
	      if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
	        const ws = $wrapperEl[0].style;
	        ws.perspectiveOrigin = `${center}px 50%`;
	      }
	    },
	    setTransition(duration) {
	      const swiper = this;
	      swiper.slides
	        .transition(duration)
	        .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
	        .transition(duration);
	    }
	  }
	};

	activeSlideIndex: any;
	isValid: any = true;
	selected = {};
	quetions:any;

	bgAudio: any = new Audio("assets/audio/slide_bg.mp3");
	swipeAudio: any = "assets/audio/question_swipe.mp3";
	clickAudio: any = "assets/audio/click.mp3";
	database: any;
	currentQuestion: any;

  constructor(public toastController: ToastController,
  						private navCtrl: NavController,
  						private storage: Storage,
  						public modalController: ModalController,
  						public alertController: AlertController) {
  	this.bgAudio.loop = true;
  	this.bgAudio.volume = 0.05;
    this.bgAudio.play();

    this.initialize();
  }
  
  async initialize(){
  	console.log(window['selectedCategory']);
  	this.quetions = window['selectedCategory'];
  	this.currentQuestion = 0;
  }

  async itemClicked(quetion, option){
  	console.log(this.selected);
  	if(!this.selected[quetion.id]){
	  	this.selected[quetion.id] = [];
  	}

  	let ind = this.selected[quetion.id].indexOf(option.id);

  	if(ind != -1){
  		this.selected[quetion.id].splice(ind, 1);
  	}else{
  		if(this.selected[quetion.id].length < quetion.maxSelect){
		  	this.selected[quetion.id].push(option.id);
  		}
  	}

  	let aud = new Audio(this.clickAudio);
  	aud.play();
  }

  isSelected(quetion, option){
  	if(!this.selected[quetion.id]){
	  	this.selected[quetion.id] = [];
  	}
  	return this.selected[quetion.id].indexOf(option.id) != -1;
  }


  async next() {
  	let aud = new Audio(this.swipeAudio);
  	aud.play();

    if(this.selected[this.quetions[this.currentQuestion].id].length >= this.quetions[this.currentQuestion].minSelect){
	    this.slider.slideNext(500);
	    if(this.currentQuestion >= this.quetions.length - 1){
	    	this.finish();
	    }else{
		    this.currentQuestion++;
	    }
  	}else{
  		const toast = await this.toastController.create({
	      message: 'Please choose atleast ' + this.quetions[this.currentQuestion].minSelect + " choice.",
	      duration: 2000,
	      position: 'middle',
	      mode: 'md'
	    });
	    toast.present();
  	}
  }

  previous() {
  	let aud = new Audio(this.swipeAudio);
  	aud.play();
    this.slider.slidePrev(500);
    this.currentQuestion--;
    if(this.currentQuestion < 0){
    	this.currentQuestion = 0;
    }
  }

  close(){
  	this.navCtrl.back();
  }

  async finish(){
  	console.log('finish');
  	// const alert = await this.alertController.create({
   //    message: 'This is an alert message.',
   //    buttons: ['ok'],
   //    mode: 'ios'
   //  });

   //  await alert.present();
    const modal = await this.modalController.create({
      component: ThanksComponent
    });
    await modal.present();
    console.log(this.quetions);
    console.log(this.selected);

    let ansArray = [];
    let c_id = this.quetions[0].category_id;

    for(let i=0; i < this.quetions.length; i++){
    	let selectedAns = this.selected[this.quetions[i].id].map((item) => {
    		return { id: item };
    	});

    	ansArray.push({
    		c_id: c_id,
    		q_id: this.quetions[i].id,
    		answer: selectedAns
    	});
    }

    console.log(ansArray);

    this.storage.get('database').then(db => {
    	db.answers[c_id] = ansArray;
    	this.storage.set('database', db).then(() => {});

	  	this.storage.get('queue').then(que => {
	  		if(!que){
	  			que = {};
	  		}
	    	que[c_id] = ansArray;
	    	this.storage.set('queue', que).then(() => {});
	  	    setTimeout(() => {
		    	this.close();
		    	modal.dismiss();
		    }, 3000);
	    });
    })

  }
}
