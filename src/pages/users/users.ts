import { ModalMessage } from './../../components/modal-message.components';
import { ModalContentPage } from './../../components/modal-content-page.components';
import { AjaxService } from './../../app/services/ajax.service';
import { User } from './../../app/model/user';
import { Component } from '@angular/core';
import { ModalController, AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  users: Array<User>;
  filteredUsers: Array<User>;

  constructor(private _ajaxService: AjaxService, public _modalCtrl: ModalController, private _callNumber: CallNumber, public _alertCtrl: AlertController) {
    this.users = new Array<User>();
    this.filteredUsers = new Array<User>();

    this._ajaxService.getAllUsers().subscribe(res => {
      this.users = res;
      
      this.users.forEach( x=> {
        x.toggleSlide = false;
      });
      this.users.sort((x, y) => {
        if (x.lastName < y.lastName) return -1;
        else if (x.lastName > y.lastName) return 1;
        else return 0;
      });

      this.filteredUsers = this.users;
    });
  };


  openModalContentPage(id) {
    let modal = this._modalCtrl.create(ModalContentPage, id);
    modal.present();
  };

  openModalMessage(id) {
    let modal = this._modalCtrl.create(ModalMessage, id);
    modal.present();
  };

  callUser(user: User) {
    const confirmDialog = this._alertCtrl.create({
      title: 'Call this number: ',
      message: `${user.firstName} ${user.lastName}: ${user.phone}`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => { }
        },
        {
          text: 'Agree',
          handler: () => {
            this._callNumber.callNumber(user.phone, true).then(res => {
            }).catch(err => { });
          }
        }
      ]
    });
    confirmDialog.present();
  };

  onSlideLeft(user: any) {
    let res = this.users.find(x=> x.id == user.id);
    res.toggleSlide = true;
  }
  onSlideRight(user: any) {
    let res = this.users.find(x=> x.id == user.id);
    res.toggleSlide = false;
  }

  getItems(event: any) {    
    const val = event.target.value;
    
    this.filteredUsers = this.users.filter((item) => {        
      return (item.lastName.toLowerCase().indexOf(val.toLowerCase()) > -1);
    })
  }
}