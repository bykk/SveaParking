import { AjaxService } from './../../../app/services/ajax.service';
import { ToastController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { User } from '../../../app/model/user';
import { Storage } from '@ionic/storage';
import _ from 'lodash';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';

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

    constructor(private _ajaxService: AjaxService, private _toastCtrl: ToastController, private _storage: Storage) {        
        this.users = new Array<User>();

        this._storage.get('loggedInUser').then(loggedInUser => {
            this.loggedInUser = loggedInUser;

            this._ajaxService.getAllUsers().subscribe(res => {
                this.users = res;

                this._ajaxService.getAllImpersonatedUsersByUser(this.loggedInUser.id).subscribe(res => {                    
                    if(_.isEmpty(res)) {
                        this.previousValuesOfImpersonatedUsers = null;
                        this.impersonatedUsers = null;
                        return;
                    }                        
                    this.previousValuesOfImpersonatedUsers = res.map((obj) => {return obj.id});
                    this.impersonatedUsers = res.map((obj) => { return obj.id });
                });
            });

            this._ajaxService.getAllImpersonatedOnBehalfByUser(this.loggedInUser.id).subscribe(res => {
                this.impersonatedUsersOnBehalf = res;
            });

        }).catch(error => {
            this.loggedInUser.firstName = 'Unknown';
            this.loggedInUser.lastName = 'Unknown';
        });

        this.releaseParkingForm = new FormGroup({
            user: new FormControl(''),
            date: new FormControl('')
        });
    }


    updateImpersonateList() {        
        if(this.previousValuesOfImpersonatedUsers != null && this.impersonatedUsers != null && this.previousValuesOfImpersonatedUsers.join() === this.impersonatedUsers.join())
            return;

        if(this.previousValuesOfImpersonatedUsers == null)
            return;

        if (this.impersonatedUsers.length > 3) {
            let toast = this._toastCtrl.create({
                message: 'You can impersonate only 3 collegues.',
                duration: 3000,
                position: 'bottom',
                cssClass: 'errorToast'
            });
            toast.present();
        }
        else if (this.impersonatedUsers.length > 0 && this.impersonatedUsers.length <= 3) {        
            let toastr = this._toastCtrl.create({
                message: 'Not implemented yet :(',
                duration: 3000,
                position: 'bottom',
                cssClass: 'warrningToastr'
            });
            toastr.present();
        }
    }

    onSubmit() {
        let result = this.releaseParkingForm.value;
        this.showWarningMessage('Not implemented yet :(');

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

}