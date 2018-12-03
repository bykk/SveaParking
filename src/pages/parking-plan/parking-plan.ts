import { Component } from '@angular/core';
import { FacadeService } from '../../app/services/facade.service';

@Component({
  selector: 'page-parking-plan',
  templateUrl: 'parking-plan.html',
})
export class ParkingPlanPage {

  constructor(private _facadeService: FacadeService) {
  }

  getSharedParkingSpots() {

  }

  getFixedParkingSpots() {
    
  }
}
