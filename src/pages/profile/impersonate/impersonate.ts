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
import { ReleaseParkingSpot } from '../../../app/model/release-parking-spot';
import { ImpersonateUser } from '../../../app/model/impersonate-user';

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
            this.showLoading();

            this._facadeService.getAllImpersonatedOnBehalfByUser(this.loggedInUser.id).subscribe((res: any) => {
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
            }, error => {
                this.loading.dismiss();
            });

            this._facadeService.getAllUsers().subscribe((res: any) => {
                this.users = res.filter(x => x.id !== this.loggedInUser.id && x.active === true);

                this._facadeService.getAllImpersonatedUsersByUser(this.loggedInUser.id).subscribe((res: any) => {
                    if (_.isEmpty(res)) {
                        this.previousValuesOfImpersonatedUsers = null;
                        this.impersonatedUsers = null;
                        this.loading.dismiss();
                        return;
                    }
                    this.previousValuesOfImpersonatedUsers = res.filter(x=> x.id !== this.loggedInUser.id && x.active === true ).map((obj) => { return obj.id });
                    this.impersonatedUsers = res.filter(x => x.id !== this.loggedInUser.id && x.active === true ).map((obj) => { return obj.id });
                    this.loading.dismiss();
                });
            }, error => {
                this.loading.dismiss();
            });
        }).catch(() => {
            this.loggedInUser.firstName = 'Unknown';
            this.loggedInUser.lastName = 'Unknown';
            this.loading.dismiss();
        });
    }

    impersonateNewUsers() {
        // impersonate new users
        var itemsProcessed = 0;
        this.showLoading();
        if (this.impersonatedUsers.length == 0) {
            this.loading.dismiss();
            this._toastService.onSuccess('Saved successfully');
        }

        this.impersonatedUsers.forEach((userId) => {
            let impersonateUser: ImpersonateUser = {
                userId: this.loggedInUser.id,
                impersonateUserId: Number(userId)
            };
            this._facadeService.addImpersonatedUser(impersonateUser).subscribe(res => {
                itemsProcessed++;
                this.previousValuesOfImpersonatedUsers = this.impersonatedUsers;

                if (itemsProcessed === this.impersonatedUsers.length) {
                    this.loading.dismiss();
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
                let impersonateUser: ImpersonateUser = {
                    userId: this.loggedInUser.id,
                    impersonateUserId: Number(userId)
                }
                this._facadeService.removeImpersonatedUser(impersonateUser).subscribe(res => {
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

    showLoading(): void {
        this.loading = this._loadingCtrl.create({
            spinner: 'circles',
            content: 'loading...'
        });
        this.loading.present();
    };

    onSubmit() {
        this.showLoading();
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
                                    this._facadeService.checkIfParkingSpotIsReleased(result.user, result.date).subscribe((res: any) => {
                                        if (res === false) {
                                            this._toastService.onWarning('Parking spot is already released');
                                            this.loading.dismiss();
                                            return;
                                        }
                                        else {
                                            let releaseParkingSpot: ReleaseParkingSpot = {
                                                userId: result.user,
                                                date: date,
                                                sendMail: false,
                                                releaseUserId: this.loggedInUser.id
                                            }
                                            this._facadeService.releaseParkingSpotForUser(releaseParkingSpot).subscribe((res: any) => {
                                                if (res === true) {
                                                    isSuccessfully = true;
                                                    this._toastService.onSuccess('You released parking spot sucessfully');
                                                    this.loading.dismiss();
                                                    this.releaseParkingForm.reset();
                                                } else {
                                                    this._toastService.onError('Something went wrong');
                                                    this.loading.dismiss();
                                                }

                                                if (!isSuccessfully) {
                                                    this._toastService.onWarning('User doesn\'t have parking spot for choosen date');
                                                    this.loading.dismiss();
                                                }
                                            })
                                        }
                                    })
                                })
                            } else {
                                this._facadeService.getSharedSpotInfo(result.user).subscribe((res: any) => {
                                    if (res.parkingSpotNumber !== null && new Date(result.date) <= new Date(res.endDate) && new Date(result.date) >= new Date(res.startDate)) {
                                        this._facadeService.checkIfParkingSpotIsReleased(result.user, result.date).subscribe((res: any) => {
                                            if (res === false) {
                                                this._toastService.onWarning('Parking spot is already released');
                                                this.loading.dismiss();
                                                return;
                                            } else {
                                                let releaseParkingSpot: ReleaseParkingSpot = {
                                                    userId: result.user,
                                                    date: result.date,
                                                    sendMail: false,
                                                    releaseUserId: this.loggedInUser.id
                                                }
                                                this._facadeService.releaseParkingSpotForUser(releaseParkingSpot).subscribe((res: any) => {
                                                    if (res == true) {
                                                        isSuccessfully = true;
                                                        this._toastService.onSuccess('You released parking spot sucessfully');
                                                        this.loading.dismiss();
                                                        this.releaseParkingForm.reset();
                                                    } else {
                                                        this._toastService.onError('Something went wrong');
                                                        this.loading.dismiss();
                                                    }

                                                    if (!isSuccessfully) {
                                                        this._toastService.onWarning('User doesn\'t have parking spot for choosen date');
                                                        this.loading.dismiss();
                                                    }
                                                });
                                            }



                                        })
                                    }
                                    else if (res.parkingSpotNumber === null) {
                                        this._toastService.onWarning("User doesn\'t have parking spot for choosen date");
                                        this.loading.dismiss();
                                    } else if (new Date(result.date) > new Date(res.endDate) || new Date(result.date) < new Date(res.endDate)) {
                                        this._toastService.onWarning("User doesn\'t have parking spot for choosen date");
                                        this.loading.dismiss();
                                    } else {
                                        this._toastService.onWarning("Something strange is going on :)");
                                        this.loading.dismiss();
                                    }
                                }, error => {
                                    this._toastService.onWarning("User doesn\'t have parking spot for choosen date");
                                    this.loading.dismiss();
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