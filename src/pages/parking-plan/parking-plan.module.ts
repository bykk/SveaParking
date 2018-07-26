import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParkingPlanPage } from './parking-plan';

@NgModule({
  declarations: [
    ParkingPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(ParkingPlanPage),
  ],
})
export class ParkingPlanPageModule {}
