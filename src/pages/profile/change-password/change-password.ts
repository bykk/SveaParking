import { ChangePassword } from './../../../app/model/change-password';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '../../../../node_modules/@angular/forms';

@Component({
    selector: 'change-password',
    templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
    changePasswordForm: FormGroup;
    changePassword: ChangePassword = {};

    constructor() {     
        this.changePasswordForm = new FormGroup({
            oldPassword: new FormControl(''),
            newPassword: new FormControl(''),
            confirmPassword: new FormControl('')
        })
    }

    onSubmit() {
        let result = this.changePasswordForm.value;
        console.log(result);
    }
}