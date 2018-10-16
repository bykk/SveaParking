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


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{ title: string, component: any, iconCss: string }>;
  rootPage: any;

  constructor(platform: Platform, status: StatusBar, splashScreen: SplashScreen, private _storage: Storage, private _toastService: ToastService) {
    platform.ready().then(() => {
      status.styleDefault();
      splashScreen.hide();      

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

    });


    this.pages = [
      { title: 'Home', component: HomePage, iconCss: 'home' },
      { title: 'Profile', component: ProfilePage, iconCss: 'contact' },
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


