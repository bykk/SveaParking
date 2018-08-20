import { AjaxService } from './../../app/services/ajax.service';
import { UserHallOfFame } from './../../app/model/user-hall-of-fame';
import { Component } from '@angular/core';

@Component({
  selector: 'page-hall-of-fame',
  templateUrl: 'hall-of-fame.html',
})
export class HallOfFamePage {
  items: Array<UserHallOfFame>;

  constructor(private ajaxService: AjaxService) {
    this.items = new Array<UserHallOfFame>();

    this.ajaxService.getUserForHallOfFame().subscribe(res=> {
      this.items = res;
      this.items.sort((x, y) => {
        return y.tookParkingCounter-x.tookParkingCounter;
      });
    });
    
  }
}
