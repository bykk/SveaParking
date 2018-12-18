import { Network } from '@ionic-native/network';
import { NgModule } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { CommonModule } from '@angular/common';

import { UserService } from './user.service';
import { ParkingService } from './parking.service';

import { UtilsService } from './utils.service';
import { ToastService } from './toast.service';
import { NetworkProvider } from '../helpers/network.provider';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers:[
    HTTP,    
    Network,
    UtilsService,
    ParkingService,  
    UserService,
  
    NetworkProvider,
    ToastService
  ]
})
export class ServicesModule { }