import { Component,ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";

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
	quetions:any = [
		{
			id: '1',
			text: "H1: The quick brown fox jumps over the lazy dog",
			maxSelect: 2,
			minSelect: 1,
			options: [
				{
					id: '1',
					tag: 'A',
					text: 'Card Button Item 2 jumps A'
				},
				{
					id: '2',
					tag: 'B',
					text: 'Card Button Item 2 jumps B'
				},
				{
					id: '3',
					tag: 'C',
					text: 'Card Button Item 2 jumps C'
				},
				{
					id: '4',
					tag: 'D',
					text: 'Card Button Item 2 jumps D'
				},
				{
					id: '5',
					tag: 'E',
					text: 'Card Button Item 2 jumps D'
				},
				{
					id: '6',
					tag: 'F',
					text: 'Card Button Item 2 jumps D'
				},
				{
					id: '7',
					tag: 'G',
					text: 'Card Button Item 2 jumps D'
				}
			]
		},
		{
			id: '2',
			text: "H1: The quick brown fox jumps over the lazy dog",
			maxSelect: 2,
			minSelect: 1,
			options: [
				{
					id: '1',
					tag: 'A',
					text: 'Card Button Item 2 jumps A'
				},
				{
					id: '2',
					tag: 'B',
					text: 'Card Button Item 2 jumps B'
				},
				{
					id: '3',
					tag: 'C',
					text: 'Card Button Item 2 jumps C'
				},
				{
					id: '4',
					tag: 'D',
					text: 'Card Button Item 2 jumps D'
				}
			]
		},
		{
			id: '3',
			text: "H1: The quick brown fox jumps over the lazy dog",
			maxSelect: 2,
			minSelect: 1,
			options: [
				{
					id: '1',
					tag: 'A',
					text: 'Card Button Item 2 jumps A'
				},
				{
					id: '2',
					tag: 'B',
					text: 'Card Button Item 2 jumps B'
				},
				{
					id: '3',
					tag: 'C',
					text: 'Card Button Item 2 jumps C'
				},
				{
					id: '4',
					tag: 'D',
					text: 'Card Button Item 2 jumps D'
				}
			]
		},
		{
			id: '4',
			text: "H1: The quick brown fox jumps over the lazy dog",
			maxSelect: 2,
			minSelect: 1,
			options: [
				{
					id: '1',
					tag: 'A',
					text: 'Card Button Item 2 jumps A'
				},
				{
					id: '2',
					tag: 'B',
					text: 'Card Button Item 2 jumps B'
				},
				{
					id: '3',
					tag: 'C',
					text: 'Card Button Item 2 jumps C'
				},
				{
					id: '4',
					tag: 'D',
					text: 'Card Button Item 2 jumps D'
				}
			]
		}
	];

	bgAudio: any = new Audio("assets/audio/slide_bg.mp3");
	swipeAudio: any = "assets/audio/question_swipe.mp3";
	clickAudio: any = "assets/audio/click.mp3";

  constructor() {
  	this.bgAudio.loop = true;
  	this.bgAudio.volume = 0.05;
    this.bgAudio.play();
  }
  
  itemClicked(quetion, option){
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

  	if(this.selected[quetion.id].length >= quetion.minSelect){
  		this.isValid = true;
  	}else{

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


  next() {
  	let aud = new Audio(this.swipeAudio);
  	aud.play();
    this.slider.slideNext(500);
    // this.slider.lockSwipeToNext(true);
    this.isValid = false;
  }

  previous() {
  	let aud = new Audio(this.swipeAudio);
  	aud.play();
    this.slider.slidePrev(500);
  }

  slideChanged(){
  	// console.log(this.slider);
  	this.slider.getActiveIndex().then((num) => {
	  	console.log(num);
	  	this.activeSlideIndex = num;
	  });
  }

  beforeNext(){
  	// console.log(this.activeSlideIndex - 1);
  }

}
