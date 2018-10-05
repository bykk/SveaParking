import { ToastService } from '../../../app/services/toast.service';
import { PasswordValidation } from './change-password-validator';
import { LoggedInUser } from './../../../app/model/register-user';
import { LoadingController, Loading } from 'ionic-angular';
import { ChangePassword } from './../../../app/model/change-password';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '../../../../node_modules/@angular/forms';
import { Storage } from '@ionic/storage';
import { FacadeService } from '../../../app/services/facade.service';


@Component({
    selector: 'change-password',
    templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
    loading: Loading;
    loggedInUser: LoggedInUser;
    changePasswordForm: FormGroup;
    changePassword: ChangePassword = {};

    constructor(private _formBuilder: FormBuilder, private _facadeService: FacadeService, private _toastService: ToastService, private _storage: Storage, private _loadingCtrl: LoadingController) {
        this._storage.get('loggedInUser').then(loggedInUser => {
            this.loggedInUser = loggedInUser;
        });

        this.changePasswordForm = _formBuilder.group({
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        }, { 
            validator: PasswordValidation.MatchPassword 
        })
    }

    onSubmit() {
        let result: ChangePassword = this.changePasswordForm.value;
        this.presentLoading();
        this._facadeService.updatePassword(this.loggedInUser.id, result.newPassword).subscribe(res => {
            this.changePasswordForm.reset();
            this.loading.dismiss();
            this._toastService.onSuccess('Password changed');
        }, () => {
            this._toastService.onError('Something went wrong');
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
}