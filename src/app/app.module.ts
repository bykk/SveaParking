import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// components
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { ParkingPlanPage } from './../pages/parking-plan/parking-plan';
import { UsersPage } from './../pages/users/users';
import { ModalContentPage } from './../components/modal-content-page.components';

// modules 
import { HttpModule } from '../../node_modules/@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { ProfileModule } from './../pages/profile/profile.module';
import { ServicesModule } from './services/services.module';

// services
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { ModalMessage } from '../components/modal-message.components';

@NgModule({
  declarations: [
    MyApp,
    HomePage,    
    LoginPage,    
    ParkingPlanPage, 
    UsersPage,
    ModalContentPage,
    ModalMessage
  ],
  imports: [
    BrowserModule,
    HttpModule,    
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot(),
    ProfileModule,
    ServicesModule    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,    
    LoginPage,        
    ParkingPlanPage,
    UsersPage,
    ModalContentPage,
    ModalMessage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},         
    CallNumber,
    SMS    
  ]
})
export class AppModule {}
