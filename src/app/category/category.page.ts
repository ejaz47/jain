import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  categories: any;
  answers: any;
  questions: any;
  clickedCat: any;

  constructor(private storage: Storage,
              public audio: AudioService,
  						private navCtrl: NavController,
  						private api: ApiService) { }

  ngOnInit() {
    this.storage.get('database').then((database) => {
      this.storage.get('language').then((language) => {
        this.categories = database[language || "english"]['categories'];
        this.questions = database[language || "english"]['questions'];
        this.answers = database['answers'];
        console.log(language, this.categories);
        this.setBadgeInfo();
      });
    });
  }

  ionViewWillEnter(){
    this.clickedCat = window['completedCategoryId'];
    window['completedCategoryId'] = null;
    if(this.categories){
      this.storage.get('database').then((database) => {
        this.answers = database['answers'];
      });
    }
  }

  ionViewWillLeave(){
    this.audio.stopMainBg();
  }

  setBadgeInfo(){
    this.categories = this.categories.map(cate => {
      if(cate.badgeInfo != undefined && cate.badgeInfo){
        cate.badgeInfo = JSON.parse(cate.badgeInfo);
        return cate;
      }

      cate.badgeInfo = {
        color: 'purple',
        icon: 'star',
        name: cate.name || 'Primary'
      }
      return cate;
    });
  }

  goback(){
  	this.navCtrl.back();
  }

  open(cate){
    if(this.answers["1"] || cate.id == 1){
      this.audio.play('click');
      this.audio.playSlideBg();
      window['selectedCategory'] = this.questions[cate.id];
      window['selectedCategoryInfo'] = cate;
      window['selectedAnswers'] = this.answers[cate.id];
      this.navCtrl.navigateForward('/home');
    }else{
      alert('Please submit the Rating first!');
    }
  }
}
