import { TakeParking } from './../model/take-parking';
import { HttpClient } from '@angular/common/http';
import { HttpConfig } from './../model/http-config';
import { Response } from '@angular/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { ReleaseParkingSpot } from '../model/release-parking-spot';

@Injectable()
export class ParkingService {
    constructor(private _http: HttpClient) { }

    getAvailableParkingSpots(config: HttpConfig): any {
        const availableToday = this.getAvailableParkingSpotsToday(config);
        const avaibableTomorrow = this.getAvailableParkingSpotsTomorrow(config);

        return Observable.forkJoin([availableToday, avaibableTomorrow]);
    }

    getAllFixedParkingSpots(config: HttpConfig): Observable<any> {
        return this._http.get(`${config.domain}/api/parking/getAllFixedParkingSpots`, { headers: config.headers }).map((response: Response) => { return response; });
    }

    getAllSharedParkingSpots(config: HttpConfig): Observable<any> {
        return this._http.get(`${config.domain}/api/parking/getAllSharedParkingSpotsToday`, { headers: config.headers }).map((response: Response) => { return response; });
    }

    getAvailableParkingSpotsToday(config: HttpConfig): Observable<any> {
        return this._http.get(`${config.domain}/api/parking/GetFreeParkingSpotsToday`, { headers: config.headers }).map((response: Response) => {                        
            return response;
        });
    }

    getAvailableParkingSpotsTomorrow(config: HttpConfig): Observable<any> {
        return this._http.get(`${config.domain}/api/parking/GetFreeParkingSpotsTomorrow`, { headers: config.headers }).map((response: Response) => { return response; });
    }

    takeParkingSpot(takeParking: TakeParking, config: HttpConfig) {
        return this._http.post(`${config.domain}/api/parking/take`, takeParking, { headers: config.headers }).map((response: Response) => { return response; });
    }

    getSharedSpotInfo(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/parking/GetSharedSpotInfo/${userId}`, { headers: config.headers }).map((response: Response) => { return response; });
    }

    getFixedSpotInfo(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/parking/GetFixedSpotInfo/${userId}`, { headers: config.headers }).map((response: Response) => { return response; });
    }

    releaseParkingSpot(userId: number, day: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/parking/NotComing/${userId}/${day}`, { headers: config.headers }).map((response: Response) => { return response; });
    }

    checkIfUserHasSharedParkingSpot(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/parking/CheckIfUserHasSharedParkingSpotRighNow/${userId}`, { headers: config.headers }).map((response: Response) => { return response; });
    }

    checkIfParkingSpotIsReleased(userId: number, date: string, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/parking/CheckIfParkingSpotIsReleased/${userId}/${date}`, { headers: config.headers }).map((response: Response) => { return response; });
    }

    releaseParkingSpotForUser(releaseParkingSpot: ReleaseParkingSpot, config: HttpConfig) {
        return this._http.post(`${config.domain}/api/parking/ReleaseParkingSpot`, releaseParkingSpot, { headers: config.headers }).map((response: Response) => { return response; });
    }
}