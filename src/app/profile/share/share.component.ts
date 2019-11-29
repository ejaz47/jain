import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {

	@Input() share_app: any;
	@Input() shareIt: any;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  	this.share_app.share_intro = this.share_app.share_intro || '';
  }

  async closeModal(){
  	await this.modalCtrl.dismiss();
  }

  async onSubmit(){
  	await this.shareIt();
  }
}
