import { ParkingSpot } from './../../app/model/parking-spot';
import { FacadeService } from './../../app/services/facade.service';
import { Component } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

@Component({
  selector: 'page-parking-plan',
  templateUrl: 'parking-plan.html',
})
export class ParkingPlanPage {
  loading: Loading;
  fixedParkingSpots: ParkingSpot[];
  sharedParkingSpots: ParkingSpot[];
  currentParkingPlanEnds: string;

  constructor(private _facadeService: FacadeService, private _loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.showLoading();
    this.getFixedParkingSpots();
    this.getSharedParkingSpots();    
  }
 
  getSharedParkingSpots() {
    this._facadeService.getAllSharedParkingSpotsToday().subscribe((res: ParkingSpot[]) => {      
      this.sharedParkingSpots = res.sort((x,y) => { return x.parkingSpotNumber -  y.parkingSpotNumber });            
      var endDate = new Date(res[0].endDate);
      this.currentParkingPlanEnds = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      this.loading.dismiss();
    });
  }

  getFixedParkingSpots() {
    this._facadeService.getAllFixedParkingSpots().subscribe((res: ParkingSpot[]) => {
      this.fixedParkingSpots = res.sort((x,y) => { return x.parkingSpotNumber -  y.parkingSpotNumber });;    
    });
  }
  
  showLoading(): void {
    this.loading = this._loadingCtrl.create({
      spinner: 'circles',
      content: 'loading...'
    });
    this.loading.present();
  };
}
