
import { LoggedInUser } from './../../../app/model/register-user';
import { UserParkingSpot } from './../../../app/model/user-parking-spot';
import { AjaxService } from './../../../app/services/ajax.service';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ParkingSpots } from '../../../app/model/const/parking-spots';

@Component({
  selector: 'my-page',
  templateUrl: 'my-page.html',
})
export class MyPage {
  userParkingSpot: UserParkingSpot;
  loggedInUser: LoggedInUser;
  hasParkingSpotRightNow: boolean;  

  constructor(private ajaxService: AjaxService, private storage: Storage) {    
    this.storage.get('loggedInUser').then((loggedInUser) => {
      this.loggedInUser = loggedInUser;

      this.ajaxService.checkIfUserHasParkingSpot(this.loggedInUser.id).subscribe(res => {
        this.userParkingSpot = res; 
        var oneDay = 24*60*60*1000;
        var startDate = new Date(this.userParkingSpot.startDate);
        var endDate = new Date(this.userParkingSpot.endDate);        

        if(res != null) {                 
          this.hasParkingSpotRightNow = new Date().toDateString() == new Date(startDate).toDateString();            
          this.userParkingSpot.daysLeft = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));        
          this.userParkingSpot.parkingType = ParkingSpots.Fixed.indexOf(Number(this.userParkingSpot.parkingSpotNumber)) != -1 ? 'Fixed' : 'Shared';         
          this.userParkingSpot.parkingPeriod = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        } else {
          this.userParkingSpot.daysLeft = '-';
          this.userParkingSpot.parkingPeriod = '-';
          this.userParkingSpot.parkingType = '-';
        }      
        
      });
    });
  }

}