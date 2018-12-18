import { FacadeService } from '../app/services/facade.service';
import { User } from './../app/model/user';
import { Platform, NavParams, ViewController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>
        Info
      </ion-title>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">
          <span ion-text color="primary" showWhen="ios">Cancel</span>
          <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content padding>
    <ion-list [hidden]="!isPageReady">
        <ion-item>
          <ion-avatar item-start>
            <img src="../assets/imgs/user.png"/>
          </ion-avatar>
        <h2>{{user.firstName}} {{ user.lastName }}</h2>          
        </ion-item>
        <ion-item>
          Email
          <ion-note item-end>
            {{ user.email }}
          </ion-note>
        </ion-item>
        <ion-item>
          Phone number
          <ion-note item-end (click)="callUser(user)">
            {{ user.phone }}
          </ion-note>
        </ion-item>
        <ion-item>
          Has fixed parking spot
          <ion-note item-end>
              <ion-icon *ngIf="user.hasFixedSpot" ios="ios-checkmark" md="md-checkmark" style="color: green;"></ion-icon>          
            <ion-icon *ngIf="!user.hasFixedSpot" ios="ios-close" md="md-close" style="color: red;"></ion-icon>
          </ion-note>
      </ion-item>
      <ion-item>
        Active:
        <ion-note item-end> 
          <ion-icon *ngIf="user.active" ios="ios-checkmark" md="md-checkmark" style="color: green;"></ion-icon>          
          <ion-icon *ngIf="!user.active" ios="ios-close" md="md-close" style="color: red;"></ion-icon>
        </ion-note>
      </ion-item>
    </ion-list>
  </ion-content>  
  `
})
export class ModalContentPage {
  loading: Loading;
  user: User = { id: null, firstName: '', lastName: '' };
  messageToSend: string;
  isPageReady: boolean;

  constructor(
    private _facadeService: FacadeService,
    private _callNumber: CallNumber,
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,   
    public alertCtrl: AlertController,    
    public loadingCtrl: LoadingController) {

    this.presentLoading();
    this._facadeService.getUserById(this.params.get('id')).subscribe((res:any) => {
      this.user = res;
      this._facadeService.getFixedSpotInfo(this.user.id).subscribe((res:any) => {
        this.isPageReady = true;
        this.user.hasFixedSpot = res.parkingSpotNumber !== null;
        this.loading.dismiss();
        
      });
    });
    this.isPageReady = false;
  }

  callUser(user: User) {
    const confirmDialog = this.alertCtrl.create({
      title: 'Call this number: ',
      message: `${user.firstName} ${user.lastName}: ${user.phone}`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => { }
        },
        {
          text: 'Agree',
          handler: () => {
            this._callNumber.callNumber(user.phone, true).then(res => {
            }).catch(err => { });
          }
        }
      ]
    });

    confirmDialog.present();
  }

  presentLoading(): void {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'loading...',
      cssClass: 'loadingBackdrop'
    });
    this.loading.present();
  };

  dismiss() {
    this.viewCtrl.dismiss();
  }
}