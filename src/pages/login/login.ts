import { ToastService } from '../../app/services/toast.service';
import { Component } from '@angular/core';
import { NavController, Loading, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserCredentials } from './../../app/model/user-credentials';
import { FacadeService } from '../../app/services/facade.service';
import { LoggedInUser } from './../../app/model/register-user';
import { HomePage } from './../home/home';

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

    this._facadeService.login(this.userCredentials).subscribe((token: any) => {
      
      this.storage.set('token_id', token.access_token).then((res) => {
     
        this._facadeService.signIn(this.userCredentials).subscribe((userData: any) => {              
          if (userData !== null) {
            let loggedInUser: LoggedInUser = {
              id: userData.registerUserModel.id,
              firstName: userData.registerUserModel.firstName,
              lastName: userData.registerUserModel.lastName,
              password: userData.registerUserModel.password
            }
  
            this.storage.set('loggedInUser', loggedInUser);
            this.storage.set('authenticated', true);
            this.navCtrl.setRoot(HomePage);
          }
        }, error => {
          this._toastService.onError('Something went wrong');
          this.loading.dismiss();
        })
      });     
    }, error => {      
      this._toastService.onError('Access denied!');
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
      spinner: 'crescent',
      content: 'loading...',
      cssClass: 'loadingBackdrop',
      dismissOnPageChange: true
    });
    this.loading.present();
  };
}
