import { ReleaseParkingSpotDay } from './../../app/model/enum/release-parking-spot-day';
import { UserParkingSpot } from './../../app/model/user-parking-spot';
import { ParkingSpot } from '../../app/model/parking-spot';
import { AjaxService } from './../../app/services/ajax.service';
import { Component } from '@angular/core';
import { ToastController, LoadingController, Loading, AlertController } from 'ionic-angular';
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

  constructor(private ajaxService: AjaxService, private storage: Storage, private toastr: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.hasParkingSpot = false;
    this.isPageReady = false;
  }

  ngOnInit() {
    this.presentLoading();

    this.storage.get('loggedInUser').then((loggedInUser) => {
      this.loggedInUser = loggedInUser;

      this.ajaxService.checkIfUserHasParkingSpot(this.loggedInUser.id).subscribe(res => {
        this.userParkingSpot = res;
        this.hasParkingSpot = new Date().toDateString() == new Date(this.userParkingSpot.startDate).toDateString();
        this.isPageReady = true;
        this.loading.dismiss();
      });
    });

    if (!this.userParkingSpot) {
      this.ajaxService.getAvailableParkingSpotsToday().subscribe(res => {
        this.availableParkingSpotsToday = res;

        this.availableParkingSpotsToday.forEach(parkingSpot => {
          this.ajaxService.getUserById(parkingSpot.userIdReplace).subscribe(res => {
            parkingSpot.replaceUser = res;

            if (parkingSpot.user.id == this.loggedInUser.id)
              this.disableTodayButton = true;
          });
        });

      });

      this.ajaxService.getAvailableParkingSpotsTomorrow().subscribe(res => {
        this.availableParkingSpotsTomorrow = res;

        this.availableParkingSpotsTomorrow.forEach(parkingSpot => {
          this.ajaxService.getUserById(parkingSpot.userIdReplace).subscribe(res => {
            parkingSpot.replaceUser = res;

            debugger;
            if (parkingSpot.user.id == this.loggedInUser.id)
              this.disableTomorrowButton = true;

          });
        });
      });
    }
  };

  releaseParkingSpotToday() {
    const confirmDialog = this.alertCtrl.create({
      title: 'Release parking spot',
      message: `Are you sure you want to release parking spot for today?`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => console.log('Disagree clicked!')
        },
        {
          text: 'Agree',
          handler: () => {
            this.presentLoading();
            this.ajaxService.releaseParkingSpot(this.loggedInUser.id, ReleaseParkingSpotDay.Today).subscribe(res => {
              this.loading.dismiss();
              this.showMessage('Parking spot released successfully');
            }, error => {
              this.showErrorMessage('Parking not released');
            });
          }
        }
      ]
    });
    confirmDialog.present();

  }

  releaseParkingSpotTomorrow() {
    const confirmDialog = this.alertCtrl.create({
      title: 'Release parking spot',
      message: `Are you sure you want to release parking spot for tomorrow?`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => console.log('Disagree clicked!')
        },
        {
          text: 'Agree',
          handler: () => {
            this.ajaxService.releaseParkingSpot(this.loggedInUser.id, ReleaseParkingSpotDay.Tomorrow).subscribe(res => {
              this.showMessage('Parking spot released successfully');
            }, error => {
              this.showErrorMessage('Parking not released');
            });
          }
        }
      ]
    });
    confirmDialog.present();
  
  }

  takeParkingSpotToday(userParkingSpot: ParkingSpot) {
    this.ajaxService.takeParkingSpot(userParkingSpot.id, this.loggedInUser.id).subscribe(res => {
      this.availableParkingSpotsToday.forEach(parkingSpot => {
        if (parkingSpot.id == userParkingSpot.id) {
          this.ajaxService.getUserById(this.loggedInUser.id).subscribe(res => {
            parkingSpot.replaceUser = res;
          });
        }
      });
      this.showMessage('Parking spot taken successfully');
    }, error => {
      this.showErrorMessage('Parking not taken, try again later');
    });

  }

  takeParkingSpotTomorrow(userParkingSpot: ParkingSpot) {
    this.ajaxService.takeParkingSpot(userParkingSpot.id, this.loggedInUser.id).subscribe(res => {
      this.availableParkingSpotsTomorrow.forEach(parkingSpot => {
        if (parkingSpot.id == userParkingSpot.id) {
          this.ajaxService.getUserById(this.loggedInUser.id).subscribe(res => {
            parkingSpot.replaceUser = res;
          });
        }
      });
      this.showMessage('Parking spot taken successfully');
    }, error => {
      this.showErrorMessage('Parking not taken, try again later');
    });
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
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

  showErrorMessage(message: string) {
    let toast = this.toastr.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'errorToast'
    });

    toast.present();
  }

  showMessage(message: string) {
    let toastr = this.toastr.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'normalToast'
    });
    toastr.present();
  }
}
