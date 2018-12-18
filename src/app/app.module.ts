
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { ProfileModule } from './../pages/profile/profile.module';
import { ServicesModule } from './services/services.module';
import { Push}  from '@ionic-native/push';

// services
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { ModalMessage } from '../components/modal-message.components';
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './helpers/token.interceptor';
import { FacadeService } from './services/facade.service';

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
    HttpClientModule,    
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
    FacadeService,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },         
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },    
    CallNumber,
    SMS,
    AuthService, 
    Push
  ]
})
export class AppModule {}
