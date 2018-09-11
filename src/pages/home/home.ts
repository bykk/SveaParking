import { ModalContentPage } from './../../components/modal-content-page.components';
import { ParkingSpot } from './../../app/model/parking-spot';
import { ReleaseParkingSpotDay } from './../../app/model/enum/release-parking-spot-day';
import { UserParkingSpot } from './../../app/model/user-parking-spot';
import { AjaxService } from './../../app/services/ajax.service';
import { Component, Output, Input } from '@angular/core';
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

  constructor(private ajaxService: AjaxService, private storage: Storage, private toastr: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl: ModalController) {
    this.hasParkingSpot = false;
    this.isPageReady = false;
  }

  ngOnInit() {
    this.presentLoading();

    this.storage.get('loggedInUser').then((loggedInUser) => {
      this.loggedInUser = loggedInUser;

      this.ajaxService.checkIfUserHasParkingSpot(this.loggedInUser.id).subscribe(res => {
        let todayDate = new Date();
        this.userParkingSpot = res;
        this.hasParkingSpot = todayDate > new Date(this.userParkingSpot.startDate) && todayDate < new Date(this.userParkingSpot.endDate);

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
            if (parkingSpot.userIdReplace == this.loggedInUser.id)
              parkingSpot.isLoggedInUser = true;

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

            if (parkingSpot.userIdReplace == this.loggedInUser.id)
              parkingSpot.isLoggedInUser = true;

            if (parkingSpot.user.id == this.loggedInUser.id)
              this.disableTomorrowButton = true;

          });
        });
      });
    }
  };

  releaseParkingSpotToday(): void {
    const confirmDialog = this.alertCtrl.create({
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
            this.ajaxService.releaseParkingSpot(this.loggedInUser.id, ReleaseParkingSpotDay.Today).subscribe(res => {
              this.loading.dismiss();
              this.disableTodayButton = true;
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

  releaseParkingSpotTomorrow(): void {
    const confirmDialog = this.alertCtrl.create({
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
            this.ajaxService.releaseParkingSpot(this.loggedInUser.id, ReleaseParkingSpotDay.Tomorrow).subscribe(res => {
              this.loading.dismiss();
              this.disableTomorrowButton = true;
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

  takeParkingSpotToday(userParkingSpot: ParkingSpot): void {
    this.presentLoading();
    var user = this.loggedInUser;

    this.ajaxService.takeParkingSpot(userParkingSpot.id, user.id).subscribe(res => {      
      this.storage.get('loggedInUser').then((loggedInUser) => {
        this.availableParkingSpotsToday.forEach(parkingSpot => {
          if (parkingSpot.id == userParkingSpot.id) {
            this.ajaxService.getUserById(loggedInUser.id).subscribe(res => {
              parkingSpot.replaceUser = res;
              parkingSpot.userIdReplace = res.id;

              if (parkingSpot.userIdReplace == this.loggedInUser.id)
                parkingSpot.isLoggedInUser = true;
            });
          }
        });
      });

      this.loading.dismiss();
      this.showMessage('Parking spot taken successfully');
    }, error => {
      this.showErrorMessage('Parking not taken, you were late :(');
    });

  }

  takeParkingSpotTomorrow(userParkingSpot: ParkingSpot): void {
    this.presentLoading();

    this.ajaxService.takeParkingSpot(userParkingSpot.id, this.loggedInUser.id).subscribe(res => {
      this.availableParkingSpotsTomorrow.forEach(parkingSpot => {
        if (parkingSpot.id == userParkingSpot.id) {
          this.ajaxService.getUserById(this.loggedInUser.id).subscribe(res => {
            parkingSpot.replaceUser = res;
            parkingSpot.userIdReplace = res.id;

            if (parkingSpot.userIdReplace == this.loggedInUser.id)
              parkingSpot.isLoggedInUser = true;

          });
        }
      });
      this.loading.dismiss();
      this.showMessage('Parking spot taken successfully');
    }, error => {
      this.showErrorMessage('Parking not taken, you were late :( ');
    });
  };

  presentLoading(): void {
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

  openModal(user) {       
    if(this.loggedInUser.id == user.id) 
      return;
    
    let modal = this.modalCtrl.create(ModalContentPage, user);
    modal.present();
  }

  showErrorMessage(message: string): void {
    let toast = this.toastr.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'errorToast'
    });
    toast.present();
  }

  showMessage(message: string): void {
    let toastr = this.toastr.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'normalToast'
    });
    toastr.present();
  }
}
