import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

// component
import { MyApp } from './../../app/app.component';

// pages
import { ProfilePage } from './profile';
import { ImpersonatePage } from './impersonate/impersonate';
import { SettingsPage } from './settings/settings';
import { ChangePasswordPage } from './change-password/change-password';

@NgModule({
  declarations: [
    ProfilePage,    
    ChangePasswordPage,    
    SettingsPage,
    ImpersonatePage
  ],
  imports: [
    BrowserModule,     
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ProfilePage,    
    ChangePasswordPage,
    SettingsPage,
    ImpersonatePage
  ],
  providers: [

  ]
})
export class ProfileModule {}
