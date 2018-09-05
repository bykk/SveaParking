import { AjaxService } from './../app/services/ajax.service';
import { User } from './../app/model/user';
import { Platform, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';

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
      <ion-item>
        Active:
        <ion-note item-end> 
          <ion-icon *ngIf="user.active" ios="ios-checkmark" md="md-checkmark" style="color: green;"></ion-icon>          
          <ion-icon *ngIf="!user.active" ios="ios-close" md="md-close" style="color: red;"></ion-icon>
        </ion-note>
      </ion-item>
      <br>
      <ion-item>
        <ion-label floating>Message:</ion-label>
        <br>
        <ion-textarea [(ngModel)]="messageToSend"></ion-textarea>
      </ion-item>
      
    </ion-list>
    <div padding>
      <button ion-button color="secondary" (click)="sendSMS()" block full large> Send SMS </button>
      <button ion-button color="primary"  (click)="sendEmail()" block full large> Send email </button>          
    </div>
  </ion-content>
  
  `
})
export class ModalContentPage {
  user: User = { id: null, firstName: '', lastName: '' };
  messageToSend: string;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    private ajaxService: AjaxService,
    private callNumber: CallNumber,
    public alertCtrl: AlertController,
    private toastr: ToastController,
    private sms: SMS) {
    this.ajaxService.getUserById(this.params.get('id')).subscribe(res => {
      console.log(res);
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
          handler: () => { }
        },
        {
          text: 'Agree',
          handler: () => {
            this.callNumber.callNumber(user.phone, true).then(res => {
            }).catch(err => { });
          }
        }
      ]
    });

    confirmDialog.present();
  }

  sendSMS() {
    const confirmDialog = this.alertCtrl.create({
      title: 'Send sms',
      message: `Are you sure you want to send sms to:  ${this.user.phone}?`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => { }
        },
        {
          text: 'Agree',
          handler: () => {
            this.sms.send(this.user.phone, this.messageToSend);
            this.messageToSend = '';
          }
        }
      ]
    });

    confirmDialog.present();

  };

  sendEmail() {
    this.showMessage('Not implemented yet :(');
  };

  showMessage(message: string): void {
    let toastr = this.toastr.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'warrningToastr'
    });
    toastr.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}