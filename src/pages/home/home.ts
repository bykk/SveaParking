import { UserParkingSpot } from './../../app/model/user-parking-spot';
import { AjaxService } from './../../app/services/ajax.service';
import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoggedInUser } from '../../app/model/register-user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  hasUserParkingSpot: boolean;
  availableParkingSpotsToday: Array<UserParkingSpot>;
  availableParkingSpotsTomorrow: Array<UserParkingSpot>;
  loggedInUser: LoggedInUser = { id: null, firstName: '', lastName: '' };

  constructor(private ajaxService: AjaxService, private storage: Storage, private toastr: ToastController) {
    this.hasUserParkingSpot = false; // get this flag from db


    if (this.hasUserParkingSpot) {

    } else {
      this.ajaxService.getAvailableParkingSpotsToday().subscribe(res => {
        this.availableParkingSpotsToday = res;
      });

      this.ajaxService.getAvailableParkingSpotsTomorrow().subscribe(res => {
        this.availableParkingSpotsTomorrow = res;
      });
    }

  }

  releaseParkingSpotToday() {
    this.showMessage('Parking spot released successfully');
  }

  releaseParkingSpotTomorrow() {
    this.showMessage('Parking spot released successfully');
  }

  takeParkingSpotToday(userParkingSpot: UserParkingSpot) {
    console.log(`User: ${this.loggedInUser.id} is taking place from user: ${userParkingSpot.id} for today.`);
    this.showMessage('Parking spot taken successfully');
  }

  takeParkingSpotTomorrow(userParkingSpot: UserParkingSpot) {
    console.log(`User: ${this.loggedInUser.id} is taking place from user: ${userParkingSpot.id} for tomorrow.`);
    this.showMessage('Parking spot taken successfully');
    userParkingSpot.hasParkingSpot = false;
  }

  showMessage(message:string) {
    let toastr = this.toastr.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'normalToast'
    });
    toastr.present();
  }

  ionViewDidEnter() {
    this.storage.get('loggedInUser').then((loggedInUser) => {
      this.loggedInUser = loggedInUser;
    }).catch(error => {
      this.loggedInUser.firstName = 'Unknown';
      this.loggedInUser.lastName = 'Unknown';
    });
  }
}
