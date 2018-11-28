import { ToastService } from '../../../app/services/toast.service';
import { Component } from '@angular/core';

@Component({
    selector: 'settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {
    emailNotificationEnabled: boolean;
    pushNotificationsEnabled: boolean;
    constructor(private _toastService: ToastService) {
        // write an ajax call to get current status of email notifications for user
        this.emailNotificationEnabled = false;
        this.pushNotificationsEnabled = true;
     }

     updateEmailNotification(event) {
        // let emailNotificationEnabled: boolean = event.value;        
        this._toastService.onWarning('Not implemented yet :(');    
    }
    updatePushNotification(event) {
        this._toastService.onWarning('Not implemented yet :(');
    }
}