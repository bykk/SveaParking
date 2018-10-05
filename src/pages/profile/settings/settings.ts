import { ToastService } from '../../../app/services/toast.service';
import { Component } from '@angular/core';

@Component({
    selector: 'settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {
    emailNotificationEnabled: boolean;

    constructor(private _toastService: ToastService) {
        // write an ajax call to get current status of email notifications for user
        this.emailNotificationEnabled = false;
     }

     updateEmailNotification(event) {
        // let emailNotificationEnabled: boolean = event.value;        
        this._toastService.onWarning('Not implemented yet :(');    
    }
}