import { Injectable } from "@angular/core";
import { Network } from "@ionic-native/network";
import { Platform, AlertController } from "ionic-angular";
import { BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class NetworkProvider {
    public connected: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private subscribedToNetworkStatus: boolean = false;

    constructor(private _network: Network, private _alertCtrl: AlertController, private _platform: Platform) {
    }

    public setSubscriptions() {
        if (!this.subscribedToNetworkStatus && this._platform.is("cordova")) {
            this.subscribedToNetworkStatus = true;

            if ("none" === this._network.type) {
                this.showAlert();
            }

            this._network.onConnect().subscribe((val) => {
                this.connected.next(true);                    
            });
            this._network.onchange().subscribe((val) => {

            });
            this._network.onDisconnect().subscribe((val) => {
                this.connected.next(false);
                this.showAlert();                                
            });
        }
    }

    private showAlert() {        
        let alert = this._alertCtrl.create({
            title: "You aren't connected to the internet",
            message: 'Check your internet connection',
            buttons: [{
                text: 'Ok',
                handler: () => { 
                    this._platform.exitApp(); 
                }
            }]
        })
        alert.present();
    }
}