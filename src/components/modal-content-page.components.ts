import { AjaxService } from './../app/services/ajax.service';
import { User } from './../app/model/user';
import { Platform, NavParams, ViewController, AlertController } from 'ionic-angular';
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
    <ion-list>
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
      <br>
      <button ion-button color="primary" block full> Send email </button>
    </ion-list>
  </ion-content>
  `
})
export class ModalContentPage {
    user: User = { id: null, firstName: '', lastName: '' };

    constructor(
      public platform: Platform, 
      public params: NavParams, 
      public viewCtrl: ViewController, 
      private ajaxService: AjaxService, 
      private callNumber: CallNumber,
      public alertCtrl: AlertController) {
        this.ajaxService.getUserById(this.params.get('id')).subscribe(res => {
            this.user = res;
        });
    }

    callUser(user: User) {
      const confirmDialog = this.alertCtrl.create({
        title: 'Call this number: ',
        message: `${user.firstName} ${user.lastName}: ${user.phone}`,
        buttons: [
          {
            text: 'Disagree',
            handler: () => console.log('Disagree clicked!')
          },
          {
            text: 'Agree',
            handler: () => {
              this.callNumber.callNumber(user.phone, true).then(res => {
                console.log('Launched dialer!', res);
              }).catch(err => console.log('Error launching dialer', err));
            }
          }
        ]
      });

      confirmDialog.present();     
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}