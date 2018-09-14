import { ParkingSpots } from './../../app/model/const/parking-spots';
import { ModalContentPage } from './../../components/modal-content-page.components';
import { ParkingSpot } from './../../app/model/parking-spot';
import { ReleaseParkingSpotDay } from './../../app/model/enum/release-parking-spot-day';
import { UserParkingSpot } from './../../app/model/user-parking-spot';
import { AjaxService } from './../../app/services/ajax.service';
import { Component } from '@angular/core';
import { ToastController, LoadingController, Loading, AlertController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoggedInUser } from '../../app/model/register-user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  isPageReady: boolean;
  userParkingSpot: UserParkingSpot;
  availableParkingSpotsToday: ParkingSpot[];
  availableParkingSpotsTomorrow: ParkingSpot[];
  loggedInUser: LoggedInUser;
  hasParkingSpot: boolean;
  disableTodayButton: boolean;
  disableTomorrowButton: boolean;
  loading: Loading;

  constructor(
    private _ajaxService: AjaxService,
    private _storage: Storage,
    private _toastrCtrl: ToastController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController) {
    this.hasParkingSpot = false;
    this.isPageReady = false;
  }

  ionViewDidLoad() {
    this.presentLoading();

    this._storage.get('loggedInUser').then(loggedInUser => {
      this.loggedInUser = loggedInUser;

      // check if user has fixed parking spot
      this._ajaxService.getFixedSpotInfo(this.loggedInUser.id).subscribe(parkingSpot => {
        this.userParkingSpot = parkingSpot;

        this.hasParkingSpot = this.userParkingSpot.parkingSpotNumber != null;

        if (this.hasParkingSpot) {
          this.userParkingSpot.parkingType = 'Fixed';
          this.userParkingSpot.parkingPeriod = '-';
          this.userParkingSpot.daysLeft = '-';

          this.isPageReady = true;
          this.loading.dismiss();
        } else {
          // check if user have share parking spot
          this._ajaxService.checkIfUserHasSharedParkingSpot(this.loggedInUser.id).subscribe(parkingSpot => {
            this.userParkingSpot = parkingSpot;
            var todayDate = new Date();
            var oneDay = 24 * 60 * 60 * 1000;
            var startDate = new Date(this.userParkingSpot.startDate);
            var endDate = new Date(this.userParkingSpot.endDate);
            var dateFormatOptions = { month: 'long', day: 'numeric' };
            this.hasParkingSpot = this.userParkingSpot.parkingSpotNumber != null;

            if (this.hasParkingSpot) {
              this.userParkingSpot.parkingType = 'Shared';
              this.userParkingSpot.parkingPeriod = `${startDate.toLocaleDateString('en-US', dateFormatOptions)} - ${endDate.toLocaleDateString('en-US', dateFormatOptions)}`;
              this.userParkingSpot.parkingType == 'Shared' ?
                this.userParkingSpot.daysLeft = Math.round(Math.abs((new Date().getTime() - endDate.getTime()) / (oneDay))) : '-';

              this.disableTodayButton = true; //TODO: get this information with ajax call
              this.isPageReady = true;
              this.loading.dismiss();
            } else {
              // user has no parking spot currently              
              this._ajaxService.getAvailableParkingSpotsToday().subscribe(availableParkingSpotsToday => {
                this.availableParkingSpotsToday = availableParkingSpotsToday;
                // console.log(JSON.stringify(availableParkingSpotsToday, null, 2));
                this.availableParkingSpotsToday.forEach(parking => {
                  this._ajaxService.getUserById(parking.userIdReplace).subscribe(user => {
                    parking.replaceUser = user;

                    if (parkingSpot.userIdReplace == this.loggedInUser.id)
                      parkingSpot.isLoggedInUser = true;

                    // if (parkingSpot.user.id == this.loggedInUser.id)
                    //   this.disableTodayButton = true;
                  });
                })
              });

              this._ajaxService.getAvailableParkingSpotsTomorrow().subscribe(availableParkingSpotsTomorrow => {
                this.availableParkingSpotsTomorrow = availableParkingSpotsTomorrow;
                // console.log(JSON.stringify(availableParkingSpotsTomorrow, null, 2));
                this.availableParkingSpotsTomorrow.forEach(parking => {
                  this._ajaxService.getUserById(parking.userIdReplace).subscribe(user => {
                    parking.replaceUser = user;

                    if (parkingSpot.userIdReplace == this.loggedInUser.id)
                      parkingSpot.isLoggedInUser = true;

                    // if (parkingSpot.user.id == this.loggedInUser.id)
                    //   this.disableTomorrowButton = true;
                  });
                });
              });
              this.loading.dismiss();
              this.isPageReady = true;
            }
          });
        }
      });
    });

  };

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
            this.presentLoading();
            this._ajaxService.releaseParkingSpot(this.loggedInUser.id, ReleaseParkingSpotDay.Today).subscribe(res => {
              this.loading.dismiss();
              this.disableTodayButton = true;
              this.showSuccessMessage('Parking spot released successfully');
            }, error => {
              this.showErrorMessage('Parking not released');
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
            this.presentLoading();
            this._ajaxService.releaseParkingSpot(this.loggedInUser.id, ReleaseParkingSpotDay.Tomorrow).subscribe(res => {
              this.loading.dismiss();
              this.disableTomorrowButton = true;
              this.showSuccessMessage('Parking spot released successfully');
            }, error => {
              this.showErrorMessage('Parking not released');
            });
          }
        }
      ]
    });
    confirmDialog.present();
  }

  takeParkingSpotToday(userParkingSpot: ParkingSpot): void {
    this.presentLoading();
    var user = this.loggedInUser;

    this._ajaxService.takeParkingSpot(userParkingSpot.id, user.id).subscribe(res => {
      this._storage.get('loggedInUser').then((loggedInUser) => {
        this.availableParkingSpotsToday.forEach(parkingSpot => {
          if (parkingSpot.id == userParkingSpot.id) {
            this._ajaxService.getUserById(loggedInUser.id).subscribe(res => {
              parkingSpot.replaceUser = res;
              parkingSpot.userIdReplace = res.id;

              if (parkingSpot.userIdReplace == this.loggedInUser.id)
                parkingSpot.isLoggedInUser = true;
            });
          }
        });
      });

      this.loading.dismiss();
      this.showSuccessMessage('Parking spot taken successfully');
    }, error => {
      this.showErrorMessage('Parking not taken, something went wrong :(');
    });

  }

  takeParkingSpotTomorrow(userParkingSpot: ParkingSpot): void {
    this.presentLoading();

    this._ajaxService.takeParkingSpot(userParkingSpot.id, this.loggedInUser.id).subscribe(res => {
      this.availableParkingSpotsTomorrow.forEach(parkingSpot => {
        if (parkingSpot.id == userParkingSpot.id) {
          this._ajaxService.getUserById(this.loggedInUser.id).subscribe(res => {
            parkingSpot.replaceUser = res;
            parkingSpot.userIdReplace = res.id;

            if (parkingSpot.userIdReplace == this.loggedInUser.id)
              parkingSpot.isLoggedInUser = true;

          });
        }
      });
      this.loading.dismiss();
      this.showSuccessMessage('Parking spot taken successfully');
    }, error => {
      this.showErrorMessage('Parking not taken, something went wrong :( ');
    });
  };

  presentLoading(): void {
    this.loading = this._loadingCtrl.create({
      spinner: 'bubbles',
      content: '',
      cssClass: 'loadingBackdrop'
    });
    this.loading.present();
  };

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

  openModal(user) {
    if (this.loggedInUser.id == user.id)
      return;

    let modal = this._modalCtrl.create(ModalContentPage, user);
    modal.present();
  }

  showErrorMessage(message: string): void {
    let toast = this._toastrCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'errorToast'
    });
    toast.present();
  }

  showSuccessMessage(message: string): void {
    let toastr = this._toastrCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'normalToast'
    });
    toastr.present();
  }
}
