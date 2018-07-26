import { HomePage } from './../home/home';
import { AuthService } from './../../app/services/auth.service';
import { User } from './../../app/model/user';
import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, ToastController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading
  userCredentials: User = { email: '', password: '' };
  constructor(
    public navCtrl: NavController, 
    private authService: AuthService, 
    private loadingCtrl: LoadingController, 
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {    
    this.showLoading();

    this.authService.login(this.userCredentials).subscribe(allowed => {
      if (allowed) {
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
