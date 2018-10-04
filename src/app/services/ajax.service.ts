import { UserParkingSpot } from './../model/user-parking-spot';
import { ParkingSpot } from '../model/parking-spot';
import { Headers, Http, Response } from '@angular/http';
import { Injectable } from "../../../node_modules/@angular/core";
import { HttpMethod } from './../model/enum/http-method.enum';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { UserCredentials } from './../model/user-credentials';
import { User } from './../model/user';

@Injectable()
export class AjaxService {
    private domain = 'http://sveaparkingapi.azurewebsites.net';

    constructor(public httpService: Http) { }

    signIn(user: UserCredentials) {
        return this.ajaxHandler<object>(`api/account/GetAccount/${user.email}/${user.password}`, HttpMethod.GET);
    }

    getAllUsers() {
        return this.ajaxHandler<Array<User>>('api/user/GetAllUsers', HttpMethod.GET);
    }

    getUserById(id: number) {
        return this.ajaxHandler<User>(`api/account/getUserById/${id}`, HttpMethod.GET, id);
    }

    getAllImpersonatedUsersByUser(userId:number) {
        return this.ajaxHandler<Array<User>>(`api/user/GetAllImpersonatedUsersByUser/${userId}`, HttpMethod.GET);
    }

    getAllImpersonatedOnBehalfByUser(userId: number){
        return this.ajaxHandler<Array<User>>(`api/user/GetAllImpersonatedOnBehalfByUser/${userId}`, HttpMethod.GET);
    }

    getAvailableParkingSpotsToday() {
        return this.ajaxHandler<Array<ParkingSpot>>('api/parking/GetFreeParkingSpotsToday', HttpMethod.GET);
    }

    getAvailableParkingSpotsTomorrow() {
        return this.ajaxHandler<Array<ParkingSpot>>('api/parking/GetFreeParkingSpotsTomorrow', HttpMethod.GET);
    }

    getSharedSpotInfo(userId: number) {
        return this.ajaxHandler<Array<object>>(`api/parking/GetSharedSpotInfo/${userId}`, HttpMethod.GET);
    }

    getFixedSpotInfo(userId: number) {
        return this.ajaxHandler<Array<ParkingSpot>>(`api/parking/GetFixedSpotInfo/${userId}`, HttpMethod.GET);
    }

    releaseParkingSpot(userId: number, day: number) {
        return this.ajaxHandler<object>(`api/parking/NotComing/${userId}/${day}`, HttpMethod.GET);
    }

    checkIfUserHasSharedParkingSpot(userId: number) {
        return this.ajaxHandler<UserParkingSpot>(`api/parking/CheckIfUserHasSharedParkingSpotRighNow/${userId}`, HttpMethod.GET);
    }

    takeParkingSpot(parkingSpot: number, replaceUserId: number) {
        return this.ajaxHandler<object>(`api/parking/take/${parkingSpot}/${replaceUserId}`, HttpMethod.GET);
    }

    addImpersonatedUser(userId: number, impersonatedUserId: number) {
        return this.ajaxHandler<boolean>(`api/user/AddImpersonatedUser/${userId}/${impersonatedUserId}`, HttpMethod.POST);
    }

    removeImpersonatedUser(userId: number, impersonatedUserId: number) {
        return this.ajaxHandler<boolean>(`api/user/RemoveImpersonatedUser/${userId}/${impersonatedUserId}`, HttpMethod.POST);
    }

    updatePassword(userId: number, newPassword: string) {
        return this.ajaxHandler<string>(`api/user/UpdatePassword/${userId}/${newPassword}`, HttpMethod.GET);
    }

    // checkIfParkingSpotIsReleased(userId: number, date: Date) {        
    //     return this.ajaxHandler<boolean>(`api/parking/CheckIfParkingSpotIsReleased/${userId}/${date}`, HttpMethod.GET);        
    // }

    private toCamelCase(o) {
        var newO, origKey, newKey, value
        if (o instanceof Array) {
            return o.map(function (value) {
                if (typeof value === "object") {
                    value = this.toCamelCase(value)
                }
                return value
            })
        } else {
            newO = {}
            for (origKey in o) {
                if (o.hasOwnProperty(origKey)) {
                    newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
                    value = o[origKey]
                    if (value instanceof Array || (value !== null && value.constructor === Object)) {
                        value = this.toCamelCase(value)
                    }
                    newO[newKey] = value
                }
            }
        }
        return newO
    }

    private convertToCamelCase(response: string) {
        let responseObj = JSON.parse(response);
        let resultArrayOfObjects = new Array<object>();

        if (responseObj instanceof Array) {
            responseObj.forEach(object => {
                resultArrayOfObjects.push(this.toCamelCase(object));
            });

            return resultArrayOfObjects;
        }
        return this.toCamelCase(responseObj);

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
                return this.httpService.get(baseUrl, { headers: headers }).map((response: Response) => { return this.convertToCamelCase(response.json()); });
            case HttpMethod.POST:
                return this.httpService.post(baseUrl, data, { headers: headers }).map((response: Response) => { return response.json(); });
            case HttpMethod.DELETE:
                return this.httpService.put(baseUrl, data, { headers: headers }).map((response: Response) => { return response.json(); });
            case HttpMethod.PUT:
                return this.httpService.put(baseUrl, data, { headers: headers }).map((response: Response) => { return response.json(); });
        }
    }
}