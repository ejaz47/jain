import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  categories: any;
  answers: any;
  questions: any;

  constructor(private storage: Storage,
  						private navCtrl: NavController,
  						private api: ApiService) { }

  ngOnInit() {
    this.storage.get('database').then((database) => {
      this.storage.get('language').then((language) => {
        this.categories = database[language || "english"]['categories'];
        this.questions = database[language || "english"]['questions'];
        this.answers = database['answers'];
      });
    });
  }

  ionViewWillEnter(){
    if(this.categories){
      this.storage.get('database').then((database) => {
        this.answers = database['answers'];
      });
    }
  }

  goback(){
  	this.navCtrl.back();
  }

  open(cate){
    window['selectedCategory'] = this.questions[cate.id];
    this.navCtrl.navigateForward('/home');
  }
}
