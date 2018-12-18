import { ToastService } from './../../app/services/toast.service';
import { TakeParking } from './../../app/model/take-parking';
import { ParkingSpot } from './../../app/model/parking-spot';
import { UserParkingSpot } from './../../app/model/user-parking-spot';
import { LoggedInUser } from './../../app/model/register-user';
import { FacadeService } from './../../app/services/facade.service';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Loading, LoadingController, AlertController } from 'ionic-angular';
import { ReleaseParkingSpotDay } from './../../app/model/enum/release-parking-spot-day';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loggedInUser: LoggedInUser;
  availableParkingSpotsToday: ParkingSpot[];
  availableParkingSpotsTomorrow: ParkingSpot[];
  availableParkingSpots: any;
  loggedUserParkingSpot: UserParkingSpot;
  isPageReady: boolean;
  hasParkingSpot: boolean;
  disableTodayButton: boolean;
  disableTomorrowButton: boolean;
  userAlreadyHasParkingSpotToday: boolean = false;
  userAlreadyHasParkingSpotTomorrow: boolean = false;
  loading: Loading;

  constructor(private _facadeService: FacadeService, private _storage: Storage, private _loadingCtrl: LoadingController, private _toastService: ToastService, private _alertCtrl: AlertController) {
    this.initComponent();
  }

  initComponent() {
    this.showLoading();

    this._storage.get('loggedInUser').then(loggedUser => {
      this.loggedInUser = loggedUser;
      this._facadeService.getFixedSpotInfo(this.loggedInUser.id).subscribe((res: any) => {
        if (res.parkingSpotNumber != null) {
          this.loggedUserParkingSpot = res;
          this.hasParkingSpot = true;
          this.initHasParkingSpot(true);
        }
        else {
          this._facadeService.checkIfUserHasSharedParkingSpot(this.loggedInUser.id).subscribe((res: any) => {
            this.hasParkingSpot = res != null && res.parkingSpotNumber != null;

            if (this.hasParkingSpot) {
              this.loggedUserParkingSpot = res;
              this.initHasParkingSpot(false);
            } else {
              this.initNoParkingSpot();
            }
          });
        }

      }, error => {
        this.loading.dismiss();
      })
    })
  }

  initHasParkingSpot(isFixedParkingSpot: boolean) {
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (isFixedParkingSpot) {
      this.loggedUserParkingSpot.parkingType = 'Fixed';
      this.loggedUserParkingSpot.parkingPeriod = '-';
      this.loggedUserParkingSpot.daysLeft = '-';

    } else {
      var startDate = new Date(this.loggedUserParkingSpot.startDate);
      var endDate = new Date(this.loggedUserParkingSpot.endDate);
      var dateFormatOptions = { month: 'long', day: 'numeric' };
      var oneDay = 24 * 60 * 60 * 1000;

      this.loggedUserParkingSpot.parkingType = 'Shared';
      this.loggedUserParkingSpot.parkingPeriod = `${startDate.toLocaleDateString('en-US', dateFormatOptions)} - ${endDate.toLocaleDateString('en-US', dateFormatOptions)}`;
      this.loggedUserParkingSpot.parkingType == 'Shared' ?
        this.loggedUserParkingSpot.daysLeft = Math.round(Math.abs((new Date().getTime() - endDate.getTime()) / (oneDay))) : '-';
    }

    this._facadeService.checkIfParkingSpotIsReleased(this.loggedInUser.id, `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getDate()}`).subscribe((res: any) => {
      if (res === false) {
        this.disableTodayButton = true;
      }
      this._facadeService.checkIfParkingSpotIsReleased(this.loggedInUser.id, `${tomorrow.getUTCFullYear()}-${tomorrow.getUTCMonth() + 1}-${tomorrow.getDate()}`).subscribe((res: any) => {
        if (res === false) {
          this.disableTomorrowButton = true;
        }

        this.loading.dismiss();
        this.isPageReady = true;
      })
    });
  }

  initNoParkingSpot() {
    this._facadeService.getAvailableParkingSpots().subscribe((res: any) => {
      this.availableParkingSpotsToday = res[0];
      this.availableParkingSpotsTomorrow = res[1];

      // fetch user data for replacments
      this.availableParkingSpotsToday.forEach(parking => {
        if (parking.userIdReplace !== 0) {
          this._facadeService.getUserById(parking.userIdReplace).subscribe((user: any) => {
            parking.replaceUser = user;

            if (parking.userIdReplace == this.loggedInUser.id) {
              parking.isLoggedInUser = true;
              this.userAlreadyHasParkingSpotToday = true;
            }
          }, error => {
            this.loading.dismiss();
            this._toastService.onError('Something went wrong');
          });
        }
      });

      // fetch user data for replacments
      this.availableParkingSpotsTomorrow.forEach(parking => {
        if (parking.userIdReplace !== 0) {
          this._facadeService.getUserById(parking.userIdReplace).subscribe((user: any) => {
            parking.replaceUser = user;

            if (parking.userIdReplace == this.loggedInUser.id) {
              parking.isLoggedInUser = true;
              this.userAlreadyHasParkingSpotTomorrow = true;
            }
          }, error => {
            this.loading.dismiss();
            this._toastService.onError('Something went wrong');
          });
        }
      });
      setTimeout(() => {
        this.loading.dismiss();
        this.isPageReady = true;
      }, 2000);

    }, error => {
      this.loading.dismiss();
      this._toastService.onError('Something went wrong');
    })
  }

  releaseParkingSpotToday(): void {
    const confirmDialog = this._alertCtrl.create({
      title: 'Release parking spot',
      message: `Are you sure you want to release parking spot for today?`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => { }
        },
        {
          text: 'Agree',
          handler: () => {
            this.showLoading();
            this._facadeService.releaseParkingSpot(this.loggedInUser.id, ReleaseParkingSpotDay.Today).subscribe((res) => {
              this.loading.dismiss();
              this.disableTodayButton = true;
              this.userAlreadyHasParkingSpotToday = false;
              this._toastService.onSuccess('Parking spot released successfully');
            }, (error) => {
              this._toastService.onError('Parking not released');
              this.loading.dismiss();
            });
          }
        }
      ]
    });
    confirmDialog.present();
  }


  releaseParkingSpotTomorrow(): void {
    const confirmDialog = this._alertCtrl.create({
      title: 'Release parking spot',
      message: `Are you sure you want to release parking spot for tomorrow?`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => { }
        },
        {
          text: 'Agree',
          handler: () => {
            this.showLoading();
            this._facadeService.releaseParkingSpot(this.loggedInUser.id, ReleaseParkingSpotDay.Tomorrow).subscribe(res => {
              this.loading.dismiss();
              this.disableTomorrowButton = true;
              this.userAlreadyHasParkingSpotTomorrow = false;
              this._toastService.onSuccess('Parking spot released successfully');
            }, () => {
              this._toastService.onError('Parking not released');
              this.loading.dismiss();
            });
          }
        }
      ]
    });
    confirmDialog.present();
  }

  takeParkingSpotToday(userParkingSpot: ParkingSpot): void {
    this.showLoading();

    let takeParking: TakeParking = {
      spotId: userParkingSpot.id,
      userIdReplace: this.loggedInUser.id
    }
    this._facadeService.takeParkingSpot(takeParking).subscribe((res: any) => {
      this._storage.get('loggedInUser').then((loggedInUser) => {
        this.availableParkingSpotsToday.forEach(parkingSpot => {
          if (parkingSpot.id == userParkingSpot.id) {
            this._facadeService.getUserById(loggedInUser.id).subscribe((res: any) => {
              parkingSpot.replaceUser = res;
              parkingSpot.userIdReplace = res.id;

              if (parkingSpot.userIdReplace == this.loggedInUser.id) {
                this.userAlreadyHasParkingSpotToday = true;
                parkingSpot.isLoggedInUser = true;
              }

              this.loading.dismiss();
              this._toastService.onSuccess('Parking spot taken successfully');
            });
          }
        });
      });


    }, () => {
      this._toastService.onError('Parking not taken, something went wrong :(');
      this.loading.dismiss();
    });

  }

  takeParkingSpotTomorrow(userParkingSpot: ParkingSpot): void {
    this.showLoading();

    let takeParking: TakeParking = {
      spotId: userParkingSpot.id,
      userIdReplace: this.loggedInUser.id
    }

    this._facadeService.takeParkingSpot(takeParking).subscribe(res => {
      this.availableParkingSpotsTomorrow.forEach(parkingSpot => {
        if (parkingSpot.id == userParkingSpot.id) {
          this._facadeService.getUserById(this.loggedInUser.id).subscribe((res: any) => {
            parkingSpot.replaceUser = res;
            parkingSpot.userIdReplace = res.id;

            if (parkingSpot.userIdReplace == this.loggedInUser.id) {
              parkingSpot.isLoggedInUser = true;
              this.userAlreadyHasParkingSpotTomorrow = true;
            }
            this.loading.dismiss();
            this._toastService.onSuccess('Parking spot taken successfully');
          });
        }
      });

    }, () => {
      this._toastService.onError('Parking not taken, something went wrong :( ');
      this.loading.dismiss();
    });
  };


  returnParkingSpotForToday(parkingSpot: ParkingSpot) {
    const confirmDialog = this._alertCtrl.create({
      title: 'Release parking spot',
      message: `Are you sure you want to release parking spot for today?`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => { }
        },
        {
          text: 'Agree',
          handler: () => {
            confirmDialog.present();
            let takeParkingSpot: TakeParking = {
              spotId: parkingSpot.id,
              userIdReplace: 0
            };

            this._facadeService.takeParkingSpot(takeParkingSpot).subscribe(res => {
              parkingSpot.userIdReplace = 0;
              parkingSpot.replaceUser = null;
              this.userAlreadyHasParkingSpotToday = false;
              this._toastService.onSuccess('You returned spot successfully ');
            });
          }
        }
      ]
    });
    confirmDialog.present();
  }

  returnParkingSpotForTomorrow(parkingSpot: ParkingSpot) {
    const confirmDialog = this._alertCtrl.create({
      title: 'Release parking spot',
      message: `Are you sure you want to release parking spot for tomorrow?`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => { }
        },
        {
          text: 'Agree',
          handler: () => {
            confirmDialog.present();
            let takeParkingSpot: TakeParking = {
              spotId: parkingSpot.id,
              userIdReplace: 0
            };

            this._facadeService.takeParkingSpot(takeParkingSpot).subscribe(res => {
              parkingSpot.userIdReplace = 0;
              parkingSpot.replaceUser = null;
              this.userAlreadyHasParkingSpotTomorrow = false;
              this._toastService.onSuccess('You returned spot successfully ');
            });
          }
        }
      ]
    });
    confirmDialog.present();
  }

  isWeekend(day: string): boolean {
    let todayDate = new Date();
    if (day == "today") {
      return todayDate.getDay() == 6 || todayDate.getDay() == 0 ? true : false;
    }
    else if (day == "tomorrow") {
      let tomorrowDate = new Date(todayDate);
      tomorrowDate.setDate(todayDate.getDate() + 1);
      return tomorrowDate.getDay() == 6 || tomorrowDate.getDay() == 0 ? true : false;

    }
    return false;
  }

  showLoading(): void {
    this.loading = this._loadingCtrl.create({
      spinner: 'crescent',
      content: 'loading...',
      cssClass: 'loadingBackdrop'
    });
    this.loading.present();
  };

  reloadPage(refresher) {
    this.initComponent();
    refresher.complete();
  }
}
