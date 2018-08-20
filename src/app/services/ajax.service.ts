import { UserHallOfFame } from './../model/user-hall-of-fame';
import { Headers, Http, Response } from '@angular/http';
import { Injectable } from "../../../node_modules/@angular/core";
import { HttpMethod } from './../model/enum/http-method.enum';
import { Observable } from 'rxjs/Observable';
import { Mocks } from './../model/mock-objects';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { UserCredentials } from './../model/user-credentials';
import { User } from './../model/user';

@Injectable()
export class AjaxService {
    private domain = 'http://sveaparkingapi.azurewebsites.net'
    private isMock = true;

    constructor(public httpService: Http) { }

    signIn(user: UserCredentials) {
        return this.ajaxHandler<string>(`api/account/GetAccount/${user.email}/${user.password}`, HttpMethod.GET);
    }

    getAllUsers() {
        return this.isMock ?
            Observable.of(Mocks.collegues).delay(100) : this.ajaxHandler<Array<User>>('api/users', HttpMethod.GET);
    }

    getImpersonatedColleguesByUser(id: number) {
        return this.isMock ? 
            Observable.of(Mocks.impersonatedCollegues).delay(100) : this.ajaxHandler<Array<User>>('api/users/getImpersonatedByUser', HttpMethod.GET, id);
    }

    getUserForHallOfFame() {
        return this.isMock ? 
            Observable.of(Mocks.hallOfFameUsers).delay(200) : this.ajaxHandler<Array<UserHallOfFame>>('api/users/getUsersMostParkingTook', HttpMethod.GET);
    }

    private ajaxHandler<T>(route: string, httpMethod: HttpMethod, data?: any): Observable<any> {
        const baseUrl = `${this.domain}/${route}`;

        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.set('Accept', 'application/json');
        headers.set('content-type', 'application/json');

        switch (httpMethod) {
            case HttpMethod.GET:
                return this.httpService.get(baseUrl, {}).map((response: Response) => { return response.json(); });
        }
    }
}