import { LoggedInUser } from './../../../app/model/register-user';
import { UserParkingSpot } from './../../../app/model/user-parking-spot';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'my-page',
  templateUrl: 'my-page.html',
})
export class MyPage {
  userParkingSpot: UserParkingSpot;
  loggedInUser: LoggedInUser;
  hasParkingSpotRightNow: boolean;
  
  constructor(private _storage: Storage) {

  }

  ngOnInit() {

    this._storage.get('loggedInUser').then((loggedInUser) => {
      this.loggedInUser = loggedInUser;   
    });
  }
}