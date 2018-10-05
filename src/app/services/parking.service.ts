import { HttpConfig } from './../model/http-config';
import { Http, Response } from '@angular/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { UtilsService } from './utils.service';


@Injectable()
export class ParkingService {
    constructor(private _http: Http, private _utilityService: UtilsService) { }

    getAvailableParkingSpotsToday(config: HttpConfig) : Observable<any> {          
        return this._http.get(`${config.domain}/api/parking/GetFreeParkingSpotsToday`, { headers: config.headers }).map((response: Response) => { return this._utilityService.convertToCamelCase(response.json()); });
    }

    getAvailableParkingSpotsTomorrow(config: HttpConfig) : Observable<any> {
        return this._http.get(`${config.domain}/api/parking/GetFreeParkingSpotsTomorrow`, { headers: config.headers }).map((response: Response) => { return this._utilityService.convertToCamelCase(response.json()); });
    }

    takeParkingSpot(parkingSpot: number, replaceUserId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/parking/take/${parkingSpot}/${replaceUserId}`, {headers: config.headers }).map((response: Response) => { return response.json(); });
    }

    getSharedSpotInfo(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/parking/GetSharedSpotInfo/${userId}`, { headers: config.headers }).map((response: Response) => { return this._utilityService.convertToCamelCase(response.json()); });
    }

    getFixedSpotInfo(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/parking/GetFixedSpotInfo/${userId}`, { headers: config.headers }).map((response: Response) => { return this._utilityService.convertToCamelCase(response.json()); });
    }

    releaseParkingSpot(userId: number, day: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/parking/NotComing/${userId}/${day}`, { headers: config.headers }).map((response: Response) => { return response.json(); });
    }

    checkIfUserHasSharedParkingSpot(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/parking/CheckIfUserHasSharedParkingSpotRighNow/${userId}`, { headers: config.headers }).map((response: Response) => { return this._utilityService.convertToCamelCase(response.json()); });
    }

    releaseParkingSpotForUser(userId: number, date: string, sendEmail: boolean, releaseUserId: number, config: HttpConfig) {        
        return this._http.get(`${config.domain}/api/parking/ReleaseParkingSpot/${userId}/${date}/${sendEmail}/${releaseUserId}`, { headers: config.headers }).map((response: Response) => { return response.json(); });
    }
}