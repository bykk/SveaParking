import { AuthModule } from './services/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '../../node_modules/@angular/http';

// components
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { ParkingPlanPage } from './../pages/parking-plan/parking-plan';
import { HistoryPage } from './../pages/history/history';
import { AboutPage } from './../pages/about/about';
import { DashboardPage } from './../pages/dashboard/dashboard';

// services
import { AuthService } from './services/auth.service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    DashboardPage,
    AboutPage,
    HistoryPage,
    ParkingPlanPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AuthModule,    
    IonicModule.forRoot(MyApp)    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    DashboardPage,
    AboutPage,
    HistoryPage,
    ParkingPlanPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService
  ]
})
export class AppModule {}
