import { AboutPage } from './../pages/about/about';

import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { DashboardPage } from './../pages/dashboard/dashboard';
import { ParkingPlanPage } from './../pages/parking-plan/parking-plan';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{title: string, component: any}>;
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Dashboard', component: DashboardPage },
      { title: 'Your parking plan', component: ParkingPlanPage },          
      { title: 'About', component: AboutPage }      
    ];
  }

  openPage(page) {
    this.nav.setRoot(page.component)
  }

 
}

