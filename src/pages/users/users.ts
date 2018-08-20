import { AjaxService } from './../../app/services/ajax.service';
import { User } from './../../app/model/user';
import { Component } from '@angular/core';

@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  users: Array<User>;
  constructor(private ajaxService: AjaxService) {
    this.users = new Array<User>();

    this.ajaxService.getAllUsers().subscribe(res => {
      this.users = res;
    });
  }

  openModal(id: number) {
    
  }

}