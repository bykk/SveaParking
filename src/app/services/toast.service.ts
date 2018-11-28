import { ToastController, Toast } from 'ionic-angular';
import { Injectable } from "@angular/core";

@Injectable()
export class ToastService {
    private _successCssClass = 'normalToast';
    private _errorCssClass = 'errorToast';
    private _warningCssClass = 'warrningToastr';
    toast: Toast;

    constructor(private _toastCtrl: ToastController) {        
       
    }

    onSuccess(message: string) {
        this.toast = this._toastCtrl.create({    
            message: message,        
            duration: 2000,
            position: 'bottom',
            cssClass: this._successCssClass                
        });

        this.toast.present();        
    }

    onError(message: string) {
        this.toast = this._toastCtrl.create({            
            message: message,
            duration: 2000,
            position: 'bottom',
            cssClass: this._errorCssClass              
        });

        this.toast.present();        
    }

    onWarning(message: string) {
        this.toast = this._toastCtrl.create({    
            message: message,        
            duration: 2000,
            position: 'bottom',
            cssClass: this._warningCssClass         
        });
  
        this.toast.present();        
    }
}