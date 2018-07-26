import { Mocks } from './../model/mock-objects';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import { Headers } from '@angular/http';
import { HttpMethod } from './../model/enum/http-method.enum';
import { User } from './../model/user';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import * as _ from 'lodash';


@Injectable()
export class AuthService {
    private domain = '';
    private isMock = true;

    constructor(private authHttp: AuthHttp) { }

    login(user: User) {        
        let isAuthenticated = Mocks.signIn.find(obj => obj.email === user.email && obj.password === user.password);
        return this.isMock ? Observable.of(isAuthenticated).delay(100) :
            this.ajaxHandler<User>('/api/blahblah', HttpMethod.POST, user);
    }

    private ajaxHandler<T>(route: string, httpMethod: HttpMethod, data?: T): Observable<any> {
        const baseUrl = `${this.domain}/api/${route}`;
        const headers = new Headers();
        headers.set('content', 'application/json');
        const url = `${baseUrl}/${route}`;

        switch (httpMethod) {
            case HttpMethod.GET:
                return this.authHttp.get(url, { headers: headers }).flatMap(res => res.json());
            case HttpMethod.POST:
                return this.authHttp.post(url, data, { headers: headers }).flatMap(res => res.json());
            case HttpMethod.DELETE:
                return this.authHttp.put(url, data, { headers: headers }).flatMap(res => res.json());
            case HttpMethod.PUT:
                return this.authHttp.put(url, data, { headers: headers }).flatMap(res => res.json());
        }
    }
}