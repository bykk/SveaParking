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
        this.emailNotificationEnabled = false;
        this.pushNotificationsEnabled = true;
    }
    updateEmailNotification() {
        this._toastService.onWarning('Not implemented yet :(');
    }
    updatePushNotification() {
        this._toastService.onWarning('Not implemented yet :(');
    }
}