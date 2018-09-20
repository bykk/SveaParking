import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('newPassword').value;
        let confirmPassword = AC.get('confirmPassword').value;
        if (password != "" && confirmPassword != "" && password != confirmPassword) {
            AC.get('confirmPassword').setErrors({ MatchPassword: true });
            console.log('Not matched!');
        } else {
            return null;
        }
    }    
}