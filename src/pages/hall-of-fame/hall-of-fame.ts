import { UserHallOfFame } from './../../app/model/user-hall-of-fame';
import { Component } from '@angular/core';

@Component({
  selector: 'page-hall-of-fame',
  templateUrl: 'hall-of-fame.html',
})
export class HallOfFamePage {
  items: Array<UserHallOfFame>;

  constructor() {
    this.items = new Array<UserHallOfFame>();        
  }
}
