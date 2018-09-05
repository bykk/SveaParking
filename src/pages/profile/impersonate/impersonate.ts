import { AjaxService } from './../../../app/services/ajax.service';
import { ToastController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { User } from '../../../app/model/user';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'impersonate',
    templateUrl: 'impersonate.html',
})
export class ImpersonatePage {
    loggedInUser: User;
    segmentOptions: string = 'others';
    users: Array<User>;
    releaseParkingForm: FormGroup;
    listOfImpersonatedByUser: Array<User>;
    impersonatedUsers: Array<User>;

    constructor(private ajaxService: AjaxService, private toastCtrl: ToastController, private storage: Storage) {
        this.users = new Array<User>();

        this.storage.get('loggedInUser').then(loggedInUser => {
            this.loggedInUser = loggedInUser;
        }).catch(error => {
            this.loggedInUser.firstName = 'Unknown';
            this.loggedInUser.lastName = 'Unknown';
        });

        this.releaseParkingForm = new FormGroup({
            user: new FormControl(''),
            date: new FormControl('')
        });

        // this.ajaxService.getAllUsers().subscribe((res) => {
        //     this.users = res;
        // });

        // this.ajaxService.getImpersonatedColleguesByUser(this.loggedInUser.id).subscribe(res => {
        //     this.listOfImpersonatedByUser = res;
        // });
    }

    updateImpersonateList(selectedColleguesIDs: Array<string>) {
        if (selectedColleguesIDs.length > 3) {
            let toast = this.toastCtrl.create({
                message: 'You can impersonate only 3 collegues.',
                duration: 3000,
                position: 'bottom',
                cssClass: 'errorToast'
            });
            toast.present();
        }
        else if (selectedColleguesIDs.length > 0 && selectedColleguesIDs.length <= 3) {
            let toastr = this.toastCtrl.create({
                message: 'You impersonated collegues successfully',
                duration: 3000,
                position: 'bottom',
                cssClass: 'normalToast'
            });
            toastr.present();
        }
    }

    onSubmit() {
        let result = this.releaseParkingForm.value;
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