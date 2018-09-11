import { Component } from "@angular/core";
import { Platform, NavParams, ViewController, AlertController, ToastController } from "ionic-angular";
import { AjaxService } from "../app/services/ajax.service";
import { SMS } from "@ionic-native/sms";
import { User } from "../app/model/user";

@Component({
    template: `
        <ion-header>
            <ion-toolbar>
                <ion-title>
                    Send a message
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
            <ion-item>
                <ion-label floating>Message:</ion-label>
                <br>
                <ion-textarea [(ngModel)]="messageToSend"></ion-textarea>
            </ion-item>
            <ion-item>
                <button ion-button color="secondary" [disabled]="messageToSend?.length < 1" (click)="sendSMS()" block full large> Send a message </button>
            </ion-item>                       
        </ion-content>
    `
})
export class ModalMessage {
    user: User = { id: null, firstName: '', lastName: '' };
    messageToSend: string;

    constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController, private _ajaxService: AjaxService, public alertCtrl: AlertController, private _toastCtrl: ToastController, private _smsService: SMS) {

        this._ajaxService.getUserById(this.params.get('id')).subscribe(res => {
            this.user = res;
        });

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
                        this._smsService.send(this.user.phone, this.messageToSend);
                        this.showMessage('SMS sent sucessfully');
                        this.messageToSend = '';
                    }
                }
            ]
        });

        confirmDialog.present();

    };

    showMessage(message: string): void {
        let toastr = this._toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom',
          cssClass: 'normalToast'
        });
        toastr.present();
      }


    dismiss() {
        this.viewCtrl.dismiss();
    }
}