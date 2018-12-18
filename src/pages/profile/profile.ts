import { ChangePasswordPage } from './change-password/change-password';
import { Component } from '@angular/core';
import { SettingsPage } from './settings/settings';
import { ImpersonatePage } from './impersonate/impersonate';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {  
  changePassword = ChangePasswordPage;  
  settings = SettingsPage;
  impersonate = ImpersonatePage

  constructor() { }

}
