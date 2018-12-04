import { Network } from '@ionic-native/network';
import { NetworkProvider } from './services/network.provider';
import { ToastService } from './services/toast.service';
import { UsersPage } from './../pages/users/users';
import { HomePage } from './../pages/home/home';
import { ProfilePage } from './../pages/profile/profile';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { LoginPage } from './../pages/login/login';
import { AboutPage } from './../pages/about/about';
import { ParkingPlanPage } from '../pages/parking-plan/parking-plan';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{ title: string, component: any, iconCss: string }>;
  rootPage: any;

  constructor(platform: Platform, status: StatusBar, splashScreen: SplashScreen, private _storage: Storage, private _toastService: ToastService, private _networkProvider: NetworkProvider, private _network: Network) {
    platform.ready().then(() => {
      status.styleDefault();
      splashScreen.hide();

      var notificationOpenedCallback = function(jsonData) {
        this.nav.setRoot(HomePage)
      };

      window["plugins"].OneSignal
        .startInit("9f29d961-b784-4d70-9019-b5a498bb9a4c", "204542657157")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();


      this._networkProvider.setSubscriptions();

      if(this._network.type !== 'none') {
        this._storage.get('authenticated').then(isAuthenticated => {
          if (isAuthenticated != null) {
            this.nav.setRoot(HomePage)
          } else {
            this.nav.setRoot(LoginPage);
          }
        }).catch(() => {
          this.nav.setRoot(LoginPage);
          this._toastService.onError('Please enter your credentials');
        });
      }     
      
      
    
    });


    this.pages = [
      { title: 'Home', component: HomePage, iconCss: 'home' },
      { title: 'Profile', component: ProfilePage, iconCss: 'contact' },
      { title: 'Parking plan', component: ParkingPlanPage, iconCss: 'calendar' },
      { title: 'Users', component: UsersPage, iconCss: 'contacts' },
      { title: 'About', component: AboutPage, iconCss: 'help-circle' }
    ];
  }

  openPage(page) {
    if (page.title == "Home")
      this.nav.setRoot(page.component);
    else
      this.nav.push(page.component);
  }

  onLogout() {
    this._storage.remove('authenticated');
    this._storage.remove('loggedInUser');
    this.nav.setRoot(LoginPage);
  }
}


