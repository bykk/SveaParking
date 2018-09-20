import { PasswordValidation } from './change-password-validator';
import { LoggedInUser } from './../../../app/model/register-user';
import { ToastController, LoadingController, Loading } from 'ionic-angular';
import { ChangePassword } from './../../../app/model/change-password';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '../../../../node_modules/@angular/forms';
import { Storage } from '@ionic/storage';
import { AjaxService } from './../../../app/services/ajax.service';


@Component({
    selector: 'change-password',
    templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
    loading: Loading;
    loggedInUser: LoggedInUser;
    changePasswordForm: FormGroup;
    changePassword: ChangePassword = {};

    constructor(private _fb: FormBuilder, private _ajaxService: AjaxService, private _toastCtrl: ToastController, private _storage: Storage, private _loadingCtrl: LoadingController) {
        this._storage.get('loggedInUser').then(loggedInUser => {
            this.loggedInUser = loggedInUser;
        });

        this.changePasswordForm = _fb.group({
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        }, { 
            validator: PasswordValidation.MatchPassword 
        })
    }

    onSubmit() {
        let result: ChangePassword = this.changePasswordForm.value;
        this.presentLoading();
        this._ajaxService.updatePassword(this.loggedInUser.id, result.newPassword).subscribe(res => {
            this.changePasswordForm.reset();
            this.loading.dismiss();
            this.showSuccessMessage('Password changed');
        }, () => {
            this.showErrorMessage('Something went wrong');
        });
    };

    presentLoading(): void {
        this.loading = this._loadingCtrl.create({
            spinner: 'bubbles',
            content: '',
            cssClass: 'loadingBackdrop'
        });
        this.loading.present();
    };

    showWarningMessage(message: string): void {
        let toastr = this._toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            cssClass: 'warrningToastr'
        });
        toastr.present();
    };

    showSuccessMessage(message: string): void {
        let toastr = this._toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            cssClass: 'normalToast'
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
    };
}