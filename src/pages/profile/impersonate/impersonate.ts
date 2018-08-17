import { FormGroup, FormControl } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
    selector: 'impersonate',
    templateUrl: 'impersonate.html',
})
export class ImpersonatePage {
    segmentOptions: string = 'others';
    releaseParkingForm: FormGroup;    
    impersonatedCollegues = null;    
    
    listOfImpersonatedCollegues: Array<{id: number, name: string}> = [
        { id: 1, name: 'Vukasin Jelic' },
        { id: 2, name: 'Djordje Andric' }
    ]

    // get list of colleagues from api
    colleagues = [
        { id: 1, name: 'Vukasin Jelic' },
        { id: 2, name: 'Ivan Herceg' },
        { id: 3, name: 'Nemanja Vuckovic' },
        { id: 4, name: 'Srdjan Debic' },
        { id: 5, name: 'Savo Garovic' },
        { id: 6, name: 'Djordje Andric' }
    ]
    constructor() {
        this.releaseParkingForm = new FormGroup({
            user: new FormControl(''),
            date: new FormControl('')
        });
     }

    updateImpersonateList() {
        console.log(this.impersonatedCollegues);

    }

    onSubmit() {
        let result = this.releaseParkingForm.value;
        console.log(result);
    }

}