import { Component } from '@angular/core';

@Component({
    selector: 'settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {
    emailNotificationEnabled: boolean;

    constructor() {
        // write an ajax call to get current status of email notifications for user
        this.emailNotificationEnabled = false;
     }

     updateEmailNotification(event) {
        let emailNotificationEnabled: boolean = event.value;        
        // write an ajax call for updating this
        console.log(emailNotificationEnabled);
    }
}