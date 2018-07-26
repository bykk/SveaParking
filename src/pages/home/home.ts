import { LoginPage } from './../login/login';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @Input() rootPage = '';
  constructor(public navCtrl: NavController) {

  }

  logout() {
    this.navCtrl.setRoot(LoginPage);
  }
}
