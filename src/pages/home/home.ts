import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoggedInUser } from '../../app/model/register-user';

@Component({
selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {  
  loggedInUser: LoggedInUser = { id: null, firstName: '', lastName: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) { }

  ionViewDidEnter() {    
    this.storage.get('loggedInUser').then((loggedInUser) => {
      this.loggedInUser = loggedInUser;
    }).catch(error => {
      this.loggedInUser.firstName = 'Unknown';
      this.loggedInUser.lastName = 'Unknown';
    });
  } 
}
