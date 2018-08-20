import { ModalContentPage } from './../components/modal-content-page.components';
import { HTTP } from '@ionic-native/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// components
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { ParkingPlanPage } from './../pages/parking-plan/parking-plan';
import { HistoryPage } from './../pages/history/history';
import { AboutPage } from './../pages/about/about';
import { DashboardPage } from './../pages/dashboard/dashboard';
import { HallOfFamePage } from './../pages/hall-of-fame/hall-of-fame';
import { UsersPage } from './../pages/users/users';

// modules 
import { HttpModule } from '../../node_modules/@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { ProfileModule } from './../pages/profile/profile.module';

// services
import { AjaxService } from './services/ajax.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    DashboardPage,
    AboutPage,
    HistoryPage,
    ParkingPlanPage, 
    HallOfFamePage,
    UsersPage,
    ModalContentPage 
  ],
  imports: [
    BrowserModule,
    HttpModule,    
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot(),
    ProfileModule    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    DashboardPage,
    AboutPage,
    HistoryPage,
    ParkingPlanPage,
    HallOfFamePage,
    UsersPage,
    ModalContentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},    
    HTTP, 
    AjaxService
  ]
})
export class AppModule {}
