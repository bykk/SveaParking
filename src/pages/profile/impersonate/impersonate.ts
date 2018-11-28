import { ParkingSpots } from './../../../app/model/const/parking-spots';
import { User } from './../../../app/model/user';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Loading } from 'ionic-angular';
import { ToastService } from '../../../app/services/toast.service';
import { FacadeService } from '../../../app/services/facade.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
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

    constructor(private _facadeService: FacadeService, private _toastService: ToastService, private _storage: Storage, private _loadingCtrl: LoadingController, private _alertCtrl: AlertController) {
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

            this._facadeService.getAllUsers().subscribe((res: Array<User>) => {
                this.users = res.filter(x => x.id !== this.loggedInUser.id && x.active === true);

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
        // impersonate new users
        var itemsProcessed = 0;

        if (this.impersonatedUsers.length == 0) {
            this.loading.dismiss();
            this._toastService.onSuccess('Saved successfully');
        }


        this.impersonatedUsers.forEach((userId) => {
            this._facadeService.addImpersonatedUser(this.loggedInUser.id, Number(userId)).subscribe(res => {
                itemsProcessed++;
                this.previousValuesOfImpersonatedUsers = this.impersonatedUsers;

                if (itemsProcessed === this.impersonatedUsers.length) {
                    this._toastService.onSuccess('Saved successfully');
                }
            });
        });
    }

    updateImpersonateList() {
        if (this.previousValuesOfImpersonatedUsers != null && this.impersonatedUsers != null && this.previousValuesOfImpersonatedUsers.join() === this.impersonatedUsers.join())
            return;

        if (this.impersonatedUsers != null && this.impersonatedUsers.length > 3) {
            this._toastService.onWarning('You can impersonate only 3 collegues.');
            return;
        }

        // delete previous users
        var itemsDeleted = 0;
        if (this.previousValuesOfImpersonatedUsers != null && this.previousValuesOfImpersonatedUsers.length > 0) {
            this.previousValuesOfImpersonatedUsers.forEach((userId) => {
                this._facadeService.removeImpersonatedUser(this.loggedInUser.id, Number(userId)).subscribe(res => {
                    itemsDeleted++;
                    if (itemsDeleted == this.previousValuesOfImpersonatedUsers.length) {
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

        const confirmDialog = this._alertCtrl.create({
            title: 'Release parking spot',
            message: `Are you sure you want to release parking spot?`,
            buttons: [
                {
                    text: 'Disagree',
                    handler: () => { }
                },
                {
                    text: 'Agree',
                    handler: () => {
                        let result: { user: number, date: string } = this.releaseParkingForm.value;
                        let date = new Date(result.date).toISOString().substring(0, 10);
                        let isSuccessfully = false;

                        this._facadeService.getUserById(result.user).subscribe((res) => {
                            if (ParkingSpots.UsersWithFixedParking.indexOf(result.user) !== -1) {
                                this._facadeService.getFixedSpotInfo(result.user).subscribe((res) => {
                                    this._facadeService.checkIfParkingSpotIsReleased(result.user, result.date).subscribe((res) => {
                                        if (res === 'false') {
                                            this._toastService.onWarning('Parking spot is already released');
                                                return;
                                        }
                                        else {
                                            this._facadeService.releaseParkingSpotForUser(result.user, result.date, false, this.loggedInUser.id).subscribe((res) => {
                                                if (res === "true") {
                                                    isSuccessfully = true;
                                                    this._toastService.onSuccess('You released parking spot sucessfully');
                                                    this.releaseParkingForm.reset();     
                                                } else {
                                                    this._toastService.onError('Something went wrong');                      
                                                }

                                                if (!isSuccessfully) {
                                                    this._toastService.onWarning('User doesn\'t have parking spot for choosen date');
                                                }
                                            })
                                        }
                                    })
                                })
                            } else {
                                this._facadeService.getSharedSpotInfo(result.user).subscribe((res) => {
                                    if (res.parkingSpotNumber !== null && new Date(result.date) <= new Date(res.endDate) && new Date(result.date) >= new Date(res.startDate)) {
                                        this._facadeService.checkIfParkingSpotIsReleased(result.user, result.date).subscribe((res) => {                                            
                                            if (res === 'false') {
                                                this._toastService.onWarning('Parking spot is already released');
                                                return;
                                            } else {
                                                this._facadeService.releaseParkingSpotForUser(result.user, date, false, this.loggedInUser.id).subscribe((res) => {
                                                    if (res == "true") {
                                                        isSuccessfully = true;
                                                        this._toastService.onSuccess('You released parking spot sucessfully');
                                                        this.releaseParkingForm.reset();                                                        
                                                    } else {
                                                        this._toastService.onError('Something went wrong');                                                        
                                                    }     
                                                    
                                                    if (!isSuccessfully) {
                                                        this._toastService.onWarning('User doesn\'t have parking spot for choosen date');
                                                    }
                                                });
                                            }

                                           
                                            
                                        })
                                    }
                                    else if (res.parkingSpotNumber === null) {
                                        this._toastService.onWarning("User doesn\'t have parking spot for choosen date");                                        
                                    } else if (new Date(result.date) > new Date(res.endDate) || new Date(result.date) < new Date(res.endDate)) {
                                        this._toastService.onWarning("User doesn\'t have parking spot for choosen date");
                                    } else {                                        
                                        
                                    }
                                })
                            }
                        });                        
                    }
                }
            ]
        });
        confirmDialog.present();


    }
}