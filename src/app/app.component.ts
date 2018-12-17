import { ParkingPlanPage } from './../pages/parking-plan/parking-plan';
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
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{ title: string, component: any, iconCss: string }>;
  rootPage: any;

  constructor(platform: Platform, status: StatusBar, splashScreen: SplashScreen, private _storage: Storage, private _toastService: ToastService, private _networkProvider: NetworkProvider, private _network: Network, private _push: Push) {

    this.initApp(platform, status, splashScreen);

    this.pages = [
      { title: 'Home', component: HomePage, iconCss: 'home' },
      { title: 'Parking plan', component: ParkingPlanPage, iconCss: 'calendar' },
      { title: 'Profile', component: ProfilePage, iconCss: 'contact' },
      { title: 'Users', component: UsersPage, iconCss: 'contacts' }
    ];
  }

  initApp(platform: Platform, status: StatusBar, splashScreen: SplashScreen): void {
    platform.ready().then(() => {
      status.styleDefault();
      splashScreen.hide();

      this._networkProvider.setSubscriptions();
      this.pushNotificationSetup();
      
      if (this._network.type !== 'none') {
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
  }

  pushNotificationSetup() {
    const options: PushOptions = {
      android: {
        senderID: '1031685934453'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };

    const pushObject: PushObject = this._push.init(options);

    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));
    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  openPage(page): void {
    if (page.title == "Home")
      this.nav.setRoot(page.component);
    else
      this.nav.push(page.component);
  }

  onLogout(): void {
    this._storage.remove('authenticated');
    this._storage.remove('loggedInUser');
    this._storage.remove('token_id');
    this.nav.setRoot(LoginPage);
  }
}


