import { CarsPage } from './cars/cars';
import { ChangePasswordPage } from './change-password/change-password';
import { MyPage } from './my-page/my-page';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from './settings/settings';
import { ImpersonatePage } from './impersonate/impersonate';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  myPage = MyPage;
  changePassword = ChangePasswordPage;
  cars = CarsPage;
  settings = SettingsPage;
  impersonate = ImpersonatePage

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}
