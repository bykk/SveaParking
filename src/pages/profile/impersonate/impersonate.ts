import { LoadingController } from 'ionic-angular';
import { Loading } from 'ionic-angular';
import { ToastService } from '../../../app/services/toast.service';
import { FacadeService } from '../../../app/services/facade.service';
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
    isPageReady: boolean;
    loading: Loading;
    loggedInUser: User;
    segmentOptions: string = 'others';
    users: Array<User>;
    releaseParkingForm: FormGroup;
    impersonatedUsersOnBehalf: Array<User>;
    impersonatedUsers: Array<string>;
    previousValuesOfImpersonatedUsers: Array<string>;
    showMessageForNoImpersonatedOnBehalf: boolean = false;

    constructor(private _facadeService: FacadeService, private _toastService: ToastService, private _storage: Storage, private _loadingCtrl: LoadingController) {
        this.users = new Array<User>();
        this.releaseParkingForm = new FormGroup({
            user: new FormControl('', Validators.required),
            date: new FormControl('', Validators.required)
        });
        this.releaseParkingForm.disable();

        this._storage.get('loggedInUser').then(loggedInUser => {
            this.loggedInUser = loggedInUser;
            this.presentLoading();

            this._facadeService.getAllImpersonatedOnBehalfByUser(this.loggedInUser.id).subscribe(res => {
                if (_.isEmpty(res)) {
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

            this._facadeService.getAllUsers().subscribe(res => {
                this.users = res;

                this._facadeService.getAllImpersonatedUsersByUser(this.loggedInUser.id).subscribe(res => {
                    if (_.isEmpty(res)) {
                        this.previousValuesOfImpersonatedUsers = null;
                        this.impersonatedUsers = null;
                        return;
                    }
                    this.previousValuesOfImpersonatedUsers = res.map((obj) => { return obj.id });
                    this.impersonatedUsers = res.map((obj) => { return obj.id });
                });
            });

            this.loading.dismiss();
        }).catch(() => {
            this.loggedInUser.firstName = 'Unknown';
            this.loggedInUser.lastName = 'Unknown';
        });
    }

    impersonateNewUsers() {        
        this.presentLoading();
        // impersonate new users
        var itemsProcessed = 0;

        if(this.impersonatedUsers.length == 0)
            this.loading.dismiss();

        this.impersonatedUsers.forEach((userId) => {            
            this._facadeService.addImpersonatedUser(this.loggedInUser.id, Number(userId)).subscribe(res => {
                itemsProcessed++;
                this.previousValuesOfImpersonatedUsers = this.impersonatedUsers;

                if (itemsProcessed === this.impersonatedUsers.length) {
                    this._toastService.onSuccess('Saved successfully');
                    this.loading.dismiss();
                }
            });
        });        
    }

    updateImpersonateList() {
        if (this.previousValuesOfImpersonatedUsers != null && this.impersonatedUsers != null && this.previousValuesOfImpersonatedUsers.join() === this.impersonatedUsers.join())
            return;

        if (this.impersonatedUsers != null && this.impersonatedUsers.length > 3) {
            this._toastService.onError('You can impersonate only 3 collegues.');
            return;
        }

        // delete previous users
        var itemsDeleted = 0;
        if (this.previousValuesOfImpersonatedUsers != null && this.previousValuesOfImpersonatedUsers.length > 0) {
            this.previousValuesOfImpersonatedUsers.forEach((userId) => {
                this._facadeService.removeImpersonatedUser(this.loggedInUser.id, Number(userId)).subscribe(res => {
                    itemsDeleted++;                    
                    if (itemsDeleted == this.previousValuesOfImpersonatedUsers.length) {
                        this._toastService.onSuccess('Saved successfully');                        
                        this.impersonateNewUsers();
                    }
                });
            });
        } else if (this.previousValuesOfImpersonatedUsers == null && this.impersonatedUsers != null && this.impersonatedUsers.length > 0) {
            this.impersonateNewUsers();
        }

    }

    presentLoading(): void {
        this.loading = this._loadingCtrl.create({
            spinner: 'circles',
            content: '',
            cssClass: 'loadingBackdrop'
        });
        this.loading.present();
    };

    onSubmit() {
        let result: { user: number, date: string } = this.releaseParkingForm.value;
        let date = new Date(result.date).toISOString().substring(0, 10);

        this._facadeService.releaseParkingSpotForUser(result.user, date, false, this.loggedInUser.id).subscribe((res) => {
            if (res == "true") {
                this._toastService.onSuccess('You released parking spot sucessfully');
                this.releaseParkingForm.reset();
            }
            this._toastService.onError('Something went wrong');

        });
    }
}