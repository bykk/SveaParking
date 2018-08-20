import { ModalContentPage } from './../../components/modal-content-page.components';
import { AjaxService } from './../../app/services/ajax.service';
import { User } from './../../app/model/user';
import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  users: Array<User>;
  constructor(private ajaxService: AjaxService, public modalCtrl: ModalController) {
    this.users = new Array<User>();

    this.ajaxService.getAllUsers().subscribe(res => {
      this.users = res;
    });
  }

  openModal(id) {    
    let modal = this.modalCtrl.create(ModalContentPage, id);
    modal.present();
  }

}