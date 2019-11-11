import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private localNotifications: LocalNotifications) { }

  async schedule(msg: string){
  	await this.localNotifications.cancelAll();
	this.localNotifications.schedule({
		text: msg,
		trigger: {every: { hour: 10, minute: 0 }}
	});
  }

  async scheduleLogout(msg: string){
  	await this.localNotifications.cancelAll();
	// this.localNotifications.schedule({
	// 	text: msg,
	// 	trigger: {every: { minute: 15 }}
	// });
  }

}
