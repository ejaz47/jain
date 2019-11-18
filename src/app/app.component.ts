import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { UpdatorService } from './services/updator.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private localNotifications: LocalNotifications,
    private updator: UpdatorService
  ) {
    this.initializeApp();
    this.updator.isUpdateAvailable().then(suc => {
      console.log(suc);
    },err => {
      console.log(err);
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Schedule delayed notification
      // this.localNotifications.schedule({
      //    text: 'Complete the survey',
      //    trigger: {every: { minute: 15 }}
      // });
    });
  }
}
