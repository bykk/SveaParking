import { HomePage } from './../pages/home/home';
import { ProfilePage } from './../pages/profile/profile';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { ParkingPlanPage } from './../pages/parking-plan/parking-plan';
import { LoginPage } from './../pages/login/login';
import { AboutPage } from './../pages/about/about';
import { HallOfFamePage } from '../pages/hall-of-fame/hall-of-fame';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{ title: string, component: any }>;
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage, private toastCtrl: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.storage.get('authenticated').then(isAuthenticated => {
        isAuthenticated != null ? this.nav.setRoot(ProfilePage) : this.nav.setRoot(LoginPage);
      }).catch(error => {
        this.nav.setRoot(LoginPage);

        let toast = this.toastCtrl.create({
          message: 'Please enter your credentials',
          duration: 3000,
          position: 'bottom'
        });

        toast.present();
      });

    });

    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Profile', component: ProfilePage },
      // { title: 'Dashboard', component: DashboardPage },
      { title: 'Your parking plan', component: ParkingPlanPage },
      { title: 'Hall of fame', component: HallOfFamePage },
      { title: 'About', component: AboutPage }
    ];
  }

  openPage(page) {        
    if (page.title == "Home")
      this.nav.setRoot(page.component);
    else
      this.nav.push(page.component);
  }

  onLogout() {
    this.storage.remove('authenticated');
    this.storage.remove('loggedInUser');
    this.nav.setRoot(LoginPage);
  }
}


