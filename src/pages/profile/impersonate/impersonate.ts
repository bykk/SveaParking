import { AjaxService } from './../../../app/services/ajax.service';
import { ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { User } from '../../../app/model/user';
import { Storage } from '@ionic/storage';
import _ from 'lodash';

@Component({
    selector: 'impersonate',
    templateUrl: 'impersonate.html',
})
export class ImpersonatePage {
    loggedInUser: User;
    segmentOptions: string = 'others';
    users: Array<User>;
    releaseParkingForm: FormGroup;
    impersonatedUsersOnBehalf: Array<User>;
    impersonatedUsers: Array<string>;
    previousValuesOfImpersonatedUsers: Array<string>;
    showMessageForNoImpersonatedOnBehalf: boolean = false;

    constructor(private _ajaxService: AjaxService, private _toastCtrl: ToastController, private _storage: Storage) {
        this.users = new Array<User>();
        this.releaseParkingForm = new FormGroup({
            user: new FormControl('', Validators.required),
            date: new FormControl('', Validators.required)
        });
        this.releaseParkingForm.disable();

        this._storage.get('loggedInUser').then(loggedInUser => {
            this.loggedInUser = loggedInUser;

            this._ajaxService.getAllUsers().subscribe(res => {
                this.users = res;

                this._ajaxService.getAllImpersonatedUsersByUser(this.loggedInUser.id).subscribe(res => {
                    if (_.isEmpty(res)) {
                        this.previousValuesOfImpersonatedUsers = null;
                        this.impersonatedUsers = null;
                        return;
                    }
                    this.previousValuesOfImpersonatedUsers = res.map((obj) => { return obj.id });
                    this.impersonatedUsers = res.map((obj) => { return obj.id });
                });
            });

            this._ajaxService.getAllImpersonatedOnBehalfByUser(this.loggedInUser.id).subscribe(res => {
                if (_.isEmpty(res)) {
                    debugger;
                    this.impersonatedUsersOnBehalf = null;
                    this.showMessageForNoImpersonatedOnBehalf = true;
                    return;
                }
                this.showMessageForNoImpersonatedOnBehalf = false;
                this.impersonatedUsersOnBehalf = res;

                if (this.impersonatedUsersOnBehalf.length > 0) {
                    this.releaseParkingForm.enable();
                }
            });

        }).catch(error => {
            this.loggedInUser.firstName = 'Unknown';
            this.loggedInUser.lastName = 'Unknown';
        });


    }


    updateImpersonateList() {
        if (this.previousValuesOfImpersonatedUsers != null && this.impersonatedUsers != null && this.previousValuesOfImpersonatedUsers.join() === this.impersonatedUsers.join())
            return;

        if (this.impersonatedUsers != null && this.impersonatedUsers.length > 3)
            this.showErrorMessage('You can impersonate only 3 collegues.');

        // delete previous users
        if (this.previousValuesOfImpersonatedUsers != null && this.previousValuesOfImpersonatedUsers.length > 0) {
            this.previousValuesOfImpersonatedUsers.forEach((userId) => {
                this._ajaxService.removeImpersonatedUser(this.loggedInUser.id, Number(userId)).subscribe(res => {

                });
            });
        }

        // impersonate new users
        var itemsProcessed = 0;
        this.impersonatedUsers.forEach((userId) => {

            this._ajaxService.addImpersonatedUser(this.loggedInUser.id, Number(userId)).subscribe(res => {
                itemsProcessed++;
                this.previousValuesOfImpersonatedUsers = this.impersonatedUsers;
                if (itemsProcessed === this.impersonatedUsers.length) {

                    this.showSuccessMessage('Saved successfully');
                }

            });
        });

    }

    onSubmit() {
        let result = this.releaseParkingForm.value;
        this.showWarningMessage('Not implemented yet :(');

    }

    showSuccessMessage(message: string): void {
        let toastr = this._toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            cssClass: 'normalToast'
        });
        toastr.present();
    }

    showWarningMessage(message: string): void {
        let toastr = this._toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            cssClass: 'warrningToastr'
        });
        toastr.present();
    };

    showErrorMessage(message: string): void {
        let toast = this._toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            cssClass: 'errorToast'
        });
        toast.present();
    }

}