import { ToastService } from './../../app/services/toast.service';
import { ModalContentPage } from './../../components/modal-content-page.components';
import { ParkingSpot } from './../../app/model/parking-spot';
import { ReleaseParkingSpotDay } from './../../app/model/enum/release-parking-spot-day';
import { UserParkingSpot } from './../../app/model/user-parking-spot';
import { FacadeService } from '../../app/services/facade.service';
import { Component } from '@angular/core';
import { LoadingController, Loading, AlertController, ModalController } from 'ionic-angular';
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
  hasSharedParkingSpot: boolean;
  disableTodayButton: boolean;
  disableTomorrowButton: boolean;
  userAlreadyHasParkingSpotToday: boolean = false;
  userAlreadyHasParkingSpotTomorrow: boolean = false;
  loading: Loading;

  constructor(
    private _facadeService: FacadeService,
    private _storage: Storage,
    private _toastService: ToastService,
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
      this._facadeService.getFixedSpotInfo(this.loggedInUser.id).subscribe(parkingSpot => {        
        var todayDay = new Date();
        var tomorrowDay = new Date();
        tomorrowDay.setDate(todayDay.getDate() + 1);
                
        this.userParkingSpot = parkingSpot;
        this.hasParkingSpot = this.userParkingSpot.parkingSpotNumber != null;

        if (this.hasParkingSpot) {
          this.userParkingSpot.parkingType = 'Fixed';
          this.userParkingSpot.parkingPeriod = '-';
          this.userParkingSpot.daysLeft = '-';
          
          this._facadeService.checkIfParkingSpotIsReleased(this.loggedInUser.id, `${todayDay.getUTCFullYear()}-${todayDay.getUTCMonth()+1}-${todayDay.getDate()}`).subscribe((res) => {            
            if (res === 'false') {
              this.disableTodayButton = true;
            }
            this._facadeService.checkIfParkingSpotIsReleased(this.loggedInUser.id, `${tomorrowDay.getUTCFullYear()}-${tomorrowDay.getUTCMonth()+1}-${tomorrowDay.getDate()}`).subscribe((res) => {
              if (res === 'false') {
                this.disableTomorrowButton = true;
              }
              
              this.loading.dismiss();
              setTimeout(() => {this.isPageReady = true}, 500);
            })

          });

        } else {
          // check if user have share parking spot
          this._facadeService.checkIfUserHasSharedParkingSpot(this.loggedInUser.id).subscribe(parkingSpot => {
            this.userParkingSpot = parkingSpot;
            var oneDay = 24 * 60 * 60 * 1000;
            var startDate = new Date(this.userParkingSpot.startDate);
            var endDate = new Date(this.userParkingSpot.endDate);
            var dateFormatOptions = { month: 'long', day: 'numeric' };
            this.hasParkingSpot = this.userParkingSpot.parkingSpotNumber != null;
            this.hasSharedParkingSpot = this.userParkingSpot.parkingSpotNumber != null;

            if (this.hasParkingSpot) {
              this.userParkingSpot.parkingType = 'Shared';
              this.userParkingSpot.parkingPeriod = `${startDate.toLocaleDateString('en-US', dateFormatOptions)} - ${endDate.toLocaleDateString('en-US', dateFormatOptions)}`;
              this.userParkingSpot.parkingType == 'Shared' ?
                this.userParkingSpot.daysLeft = Math.round(Math.abs((new Date().getTime() - endDate.getTime()) / (oneDay))) : '-';

              this._facadeService.getAvailableParkingSpotsToday().subscribe(availableParkingSpots => {
                var res = availableParkingSpots.find(x => x.parkingSpotNumber == Number(this.userParkingSpot.parkingSpotNumber));
                if (res != undefined || res != null)
                  this.disableTodayButton = true;

                this._facadeService.getAvailableParkingSpotsTomorrow().subscribe(availableParkingSpots => {
                  if (availableParkingSpots.length > 0) {
                    var res = availableParkingSpots.find(x => x.parkingSpotNumber == Number(this.userParkingSpot.parkingSpotNumber));
                    if (res != undefined || res != null)
                      this.disableTomorrowButton = true;
                  }
                  
                  this.loading.dismiss();
                  setTimeout(() => {this.isPageReady = true}, 500);
                });
              });

            } else {
              // user has no parking spot currently              
              this._facadeService.getAvailableParkingSpotsToday().subscribe(availableParkingSpotsToday => {
                this.availableParkingSpotsToday = availableParkingSpotsToday;

                this.availableParkingSpotsToday.forEach(parking => {
                  this._facadeService.getUserById(parking.userIdReplace).subscribe(user => {
                    parking.replaceUser = user;

                    if (parking.userIdReplace == this.loggedInUser.id) {
                      parking.isLoggedInUser = true;
                      this.userAlreadyHasParkingSpotToday = true;
                    }
                  });
                });

                this._facadeService.getAvailableParkingSpotsTomorrow().subscribe(availableParkingSpotsTomorrow => {
                  this.availableParkingSpotsTomorrow = availableParkingSpotsTomorrow;

                  this.availableParkingSpotsTomorrow.forEach(parking => {
                    this._facadeService.getUserById(parking.userIdReplace).subscribe(user => {
                      parking.replaceUser = user;

                      if (parking.userIdReplace == this.loggedInUser.id) {
                        parking.isLoggedInUser = true;
                        this.userAlreadyHasParkingSpotTomorrow = true;
                      }
                    });
                  });
                  this.loading.dismiss();                 
                });
                
                setTimeout(() => {this.isPageReady = true}, 500);
              });
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
            this.presentLoading();
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
    this.presentLoading();
    var user = this.loggedInUser;

    this._facadeService.takeParkingSpot(userParkingSpot.id, user.id).subscribe(res => {
      this._storage.get('loggedInUser').then((loggedInUser) => {
        this.availableParkingSpotsToday.forEach(parkingSpot => {
          if (parkingSpot.id == userParkingSpot.id) {
            this._facadeService.getUserById(loggedInUser.id).subscribe(res => {
              parkingSpot.replaceUser = res;
              parkingSpot.userIdReplace = res.id;

              if (parkingSpot.userIdReplace == this.loggedInUser.id) {
                this.userAlreadyHasParkingSpotToday = true;
                parkingSpot.isLoggedInUser = true;
              }

            });
          }
        });
      });

      this.loading.dismiss();
      this._toastService.onSuccess('Parking spot taken successfully');
    }, () => {
      this._toastService.onError('Parking not taken, something went wrong :(');
    });

  }

  takeParkingSpotTomorrow(userParkingSpot: ParkingSpot): void {
    this.presentLoading();

    this._facadeService.takeParkingSpot(userParkingSpot.id, this.loggedInUser.id).subscribe(res => {
      this.availableParkingSpotsTomorrow.forEach(parkingSpot => {
        if (parkingSpot.id == userParkingSpot.id) {
          this._facadeService.getUserById(this.loggedInUser.id).subscribe(res => {
            parkingSpot.replaceUser = res;
            parkingSpot.userIdReplace = res.id;

            if (parkingSpot.userIdReplace == this.loggedInUser.id) {
              parkingSpot.isLoggedInUser = true;
              this.userAlreadyHasParkingSpotTomorrow = true;
            }

          });
        }
      });
      this.loading.dismiss();
      this._toastService.onSuccess('Parking spot taken successfully');
    }, () => {
      this._toastService.onError('Parking not taken, something went wrong :( ');
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
            this._facadeService.takeParkingSpot(parkingSpot.id, 0).subscribe(res => {
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
            // this._facadeService.takeParkingSpot(parkingSpot.id, 0).subscribe(res => {
            //   parkingSpot.userIdReplace = 0;
            //   parkingSpot.replaceUser = null;
            //   this.userAlreadyHasParkingSpotToday = false;
            //   this._toastService.onSuccess('You returned spot successfully ');
            // });
            this._facadeService.takeParkingSpot(parkingSpot.id, 0).subscribe(res => {
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

  presentLoading(): void {
    this.loading = this._loadingCtrl.create({
      spinner: 'circles',
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

  reloadPage(refresher) {
    this.ionViewDidLoad();
    refresher.complete();
  }
}
