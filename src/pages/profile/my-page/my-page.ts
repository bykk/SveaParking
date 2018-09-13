
import { LoggedInUser } from './../../../app/model/register-user';
import { UserParkingSpot } from './../../../app/model/user-parking-spot';
import { AjaxService } from './../../../app/services/ajax.service';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ParkingSpots } from '../../../app/model/const/parking-spots';
import { Loading, LoadingController } from 'ionic-angular';

@Component({
  selector: 'my-page',
  templateUrl: 'my-page.html',
})
export class MyPage {
  userParkingSpot: UserParkingSpot;
  loggedInUser: LoggedInUser;
  hasParkingSpotRightNow: boolean;
  loading: Loading;
  
  constructor(private ajaxService: AjaxService, private storage: Storage, public loadingCtrl: LoadingController) {

  }

  ngOnInit() {
    this.presentLoading();

    this.storage.get('loggedInUser').then((loggedInUser) => {
      this.loggedInUser = loggedInUser;

      this.ajaxService.checkIfUserHasParkingSpot(this.loggedInUser.id).subscribe(res => {
        console.log(JSON.stringify(res, null, 2));
        this.userParkingSpot = res;
        var oneDay = 24 * 60 * 60 * 1000;
        var startDate = new Date(this.userParkingSpot.startDate);
        var endDate = new Date(this.userParkingSpot.endDate);
        var dateFormatOptions =  { month: 'long', day: 'numeric' };
        this.userParkingSpot.parkingType = ParkingSpots.Fixed.indexOf(Number(this.userParkingSpot.parkingSpotNumber)) != -1 ? 'Fixed' : 'Shared';

        if (this.userParkingSpot.parkingType == 'Fixed') {
          this.hasParkingSpotRightNow = true;
          this.userParkingSpot.daysLeft = '-';
          this.userParkingSpot.parkingPeriod = '-';
        } else if (this.userParkingSpot.parkingSpotNumber != null) {
          this.hasParkingSpotRightNow = new Date().toDateString() == new Date(startDate).toDateString();
          this.userParkingSpot.daysLeft = Math.round(Math.abs((new Date().getTime() - endDate.getTime()) / (oneDay)));
          this.userParkingSpot.parkingPeriod = `${startDate.toLocaleDateString('en-US', dateFormatOptions)} - ${endDate.toLocaleDateString('en-US', dateFormatOptions)}`;
        } else {
          this.userParkingSpot.daysLeft = '-';
          this.userParkingSpot.parkingPeriod = '-';
        }

        this.loading.dismiss();
      });
    });
  }

  presentLoading(): void {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '',      
      cssClass: 'loadingBackdrop'      
    });
    this.loading.present();
  };


}