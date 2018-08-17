import { Mocks } from './../model/mock-objects';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Headers, Http, Response } from '@angular/http';
import { HttpMethod } from './../model/enum/http-method.enum';
import { User } from './../model/user';
import { Storage } from '@ionic/storage';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
    private domain = "http://sveaparkingapi.azurewebsites.net";
    private isMock = false;

    constructor(public httpService: Http) { }

    login(user: User) {        
        let isAuthenticated = Mocks.signIn.find(obj => obj.email === user.email && obj.password === user.password);
        return this.isMock ? Observable.of(isAuthenticated).delay(100) :
            this.ajaxHandler<string>(`api/account/GetAccount/${user.email}/${user.password}`, HttpMethod.GET);
    } 

    isAuthenticated(): boolean {
        // let isAuthenticated: boolean = false;
        // this.storage.get('loggedInUser').then((loggedInUser) => {
        //     if(loggedInUser != null)
        //         isAuthenticated = true;
        //   }).catch(error => {
        //         isAuthenticated = false;            
        //   });

        //   return isAuthenticated;
        return true;
    }

    private ajaxHandler<T>(route: string, httpMethod: HttpMethod, data?: T) : Observable<any> {        
        const baseUrl = `${this.domain}/${route}`;
        
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin' , '*');
        headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.set('Accept','application/json');
        headers.set('content-type','application/json');

        switch (httpMethod) {
            case HttpMethod.GET:
                return this.httpService.get(baseUrl, {}).map((response: Response) => { return response.json(); });
        }
    }
}