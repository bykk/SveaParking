import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserCredentials } from './../../app/model/user-credentials';
import { AjaxService } from './../../app/services/ajax.service';
import { LoggedInUser } from './../../app/model/register-user';
import { HomePage } from './../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading
  userCredentials: UserCredentials = { email: '', password: '' };
  constructor(
    public navCtrl: NavController, 
    private ajaxService: AjaxService, 
    private loadingCtrl: LoadingController, 
    private toastCtrl: ToastController,
    private storage: Storage) {
  }

  login() {    
    this.showLoading();
   
    this.ajaxService.signIn(this.userCredentials).subscribe(userData => {         
      if (userData != 'null') {
        let response = JSON.parse(userData);      
        let loggedInUser: LoggedInUser = { 
          id: response.RegisterUserModel.Id, 
          firstName: response.RegisterUserModel.FirstName, 
          lastName:  response.RegisterUserModel.LastName 
        };
        
        this.storage.set('authenticated', true);
        this.storage.set('loggedInUser', loggedInUser);
        this.navCtrl.setRoot(HomePage);
      } else {
        this.presentToast('Access denied')
      }
    }, (error) => {
      this.loading.dismiss();
      this.showError(error);
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(errorMessage) {
    this.loading.dismiss();
    this.presentToast(errorMessage);
  }

  presentToast(message: string) {
    this.loading.dismiss();

    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }
}
