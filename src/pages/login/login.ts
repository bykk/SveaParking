import { ToastService } from '../../app/services/toast.service';
import { Component } from '@angular/core';
import { NavController, Loading, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserCredentials } from './../../app/model/user-credentials';
import { FacadeService } from '../../app/services/facade.service';
import { LoggedInUser } from './../../app/model/register-user';
import { HomePage } from './../home/home';
import _ from 'lodash';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading
  userCredentials: UserCredentials = { email: '', password: '' };
  passwordType: string = 'password';
  passwordShown: boolean = false;

  constructor(
    public navCtrl: NavController,
    private _facadeService: FacadeService,
    private loadingCtrl: LoadingController,
    private _toastService: ToastService,
    private storage: Storage) {
  }

  login() {
    this.showLoading();

    this._facadeService.signIn(this.userCredentials).subscribe(userData => {      
      if (!_.isEmpty(userData)) {
        let response = userData;
        let loggedInUser: LoggedInUser = {
          id: response.registerUserModel.id,
          firstName: response.registerUserModel.firstName,
          lastName: response.registerUserModel.lastName,
          password: response.registerUserModel.password
        };

        this.storage.set('authenticated', true);
        this.storage.set('loggedInUser', loggedInUser);
        this.navCtrl.setRoot(HomePage);
      } else {
        this._toastService.onError('Access denied')
        this.loading.dismiss();        
      }
    }, (error) => {
      this.loading.dismiss();      
    });
  };

  togglePassword() {
    if (this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = 'password';
    } else {
      this.passwordShown = true;
      this.passwordType = 'text';
    }
  };

  showLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '',
      cssClass: 'loadingBackdrop',
      dismissOnPageChange: true
    });
    this.loading.present();
  };
}
