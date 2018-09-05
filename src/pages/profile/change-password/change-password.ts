import { ToastController } from 'ionic-angular';
import { ChangePassword } from './../../../app/model/change-password';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '../../../../node_modules/@angular/forms';

import { AjaxService } from './../../../app/services/ajax.service';

@Component({
    selector: 'change-password',
    templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
    changePasswordForm: FormGroup;
    changePassword: ChangePassword = {};

    constructor(private ajaxService: AjaxService, private toastCtrl: ToastController) {     
        this.changePasswordForm = new FormGroup({
            oldPassword: new FormControl(''),
            newPassword: new FormControl(''),
            confirmPassword: new FormControl('')
        })
    }

    onSubmit() {
        // let result = this.changePasswordForm.value;        
        this.showWarningMessage('Not implemented yet :(');    
    };

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