import { Component } from '@angular/core';

@Component({
  selector: 'page-hall-of-fame',
  templateUrl: 'hall-of-fame.html',
})
export class HallOfFamePage {
  items: Array<{ id: number, name: string, counter: number}>;
  constructor() {
    this.items = [
      { id: 1, name: 'Vukasin Jelic', counter: 5 },
      { id: 2, name: 'Ivan Herceg', counter: 10 },
      { id: 3, name: 'Nemanja Vuckovic', counter: 12 },
      { id: 4, name: 'Srdjan Debic', counter: 43 },
      { id: 5, name: 'Savo Garovic', counter: 12 },
      { id: 6, name: 'Djordje Andric', counter: 11 }
    ]
    
  }
}
