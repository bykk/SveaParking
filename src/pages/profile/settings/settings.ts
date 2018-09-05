import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Component({
    selector: 'settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {
    emailNotificationEnabled: boolean;

    constructor(private toastCtrl: ToastController) {
        // write an ajax call to get current status of email notifications for user
        this.emailNotificationEnabled = false;
     }

     updateEmailNotification(event) {
        // let emailNotificationEnabled: boolean = event.value;        
        this.showWarningMessage('Not implemented yet :(');    
    }

    showWarningMessage(message: string): void {
        let toastr = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            cssClass: 'warrningToastr'
        });
        toastr.present();
    };
}