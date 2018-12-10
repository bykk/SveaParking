import { Storage } from '@ionic/storage';
import { ModalMessage } from './../../components/modal-message.components';
import { ModalContentPage } from './../../components/modal-content-page.components';
import { FacadeService } from '../../app/services/facade.service';
import { User } from './../../app/model/user';
import { Component } from '@angular/core';
import { ModalController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  users: Array<User>;
  filteredUsers: Array<User>;
  loading: Loading;
  loggedInUser: User;

  constructor(private _facadeService: FacadeService, public _modalCtrl: ModalController, private _callNumber: CallNumber, public _alertCtrl: AlertController, private _loadingCtrl: LoadingController, private _storage:Storage) {
    this.users = new Array<User>();
    this.filteredUsers = new Array<User>();
    this.presentLoading();

    this._storage.get('loggedInUser').then(loggedInUser => { 
      this.loggedInUser = loggedInUser;

      this._facadeService.getAllUsers().subscribe((res:any) => {
        this.users = res.filter(x => x.id !== this.loggedInUser.id && x.active === true);
  
        this.users.forEach(x => {
          x.toggleSlide = false;
        });
        this.users.sort((x, y) => {
          if (x.lastName < y.lastName) return -1;
          else if (x.lastName > y.lastName) return 1;
          else return 0;
        });
  
        this.filteredUsers = this.users;
        this.loading.dismiss();
      });
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
    let res = this.users.find(x => x.id == user.id);
    res.toggleSlide = true;
  }
  onSlideRight(user: any) {
    let res = this.users.find(x => x.id == user.id);
    res.toggleSlide = false;
  }

  onInput(event: any) {    
    const val = event.target.value;
    
    if (val == undefined || val == null){
      this.filteredUsers = this.users;
      return;
    }      

    this.filteredUsers = this.users.filter((item) => {
      let fullName: string = `${item.firstName} ${item.lastName}`.toLocaleLowerCase();
      return fullName.includes(val.toLocaleLowerCase());
    })
  }

  presentLoading(): void {
    this.loading = this._loadingCtrl.create({
      spinner: 'circles',
      content: '',
      cssClass: 'loadingBackdrop'
    });
    this.loading.present();
  };
}