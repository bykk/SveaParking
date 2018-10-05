import { UserService } from './user.service';
import { HttpConfig } from '../model/http-config';
import { Headers } from '@angular/http';
import { Injectable, Injector } from "@angular/core";
import 'rxjs/add/operator/map';

import { UserCredentials } from '../model/user-credentials';
import { ParkingService } from './parking.service';

@Injectable()
export class FacadeService {
    private config: HttpConfig = {
        domain: 'http://sveaparkingapi.azurewebsites.net',
        headers: new Headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
            'Content-Type': 'application/json'
        })
    }; 

    private _parkingService: ParkingService;
    private _userService: UserService;

    constructor(private _injector: Injector) { }

    public get parkingService(): ParkingService {
        if(!this._parkingService) {
            this._parkingService = this._injector.get(ParkingService);
        }
        return this._parkingService;
    }

    public get userService(): UserService {
        if(!this._userService) {
            this._userService = this._injector.get(UserService);
        }
        return this._userService;
    }
    
    ////////////// PARKING SERVICES //////////////
    getAvailableParkingSpotsToday() {        
        return this.parkingService.getAvailableParkingSpotsToday(this.config);
    }

    getAvailableParkingSpotsTomorrow() {
        return this.parkingService.getAvailableParkingSpotsTomorrow(this.config);
    }

    takeParkingSpot(parkingSpot: number, replaceUserId: number) {        
        return this.parkingService.takeParkingSpot(parkingSpot, replaceUserId, this.config);
    }

    getSharedSpotInfo(userId: number) {
        return this.parkingService.getSharedSpotInfo(userId, this.config);
    }

    getFixedSpotInfo(userId: number) {
        return this.parkingService.getFixedSpotInfo(userId, this.config);
    }

    releaseParkingSpot(userId: number, day: number) {
        return this.parkingService.releaseParkingSpot(userId, day, this.config);
    }

    checkIfUserHasSharedParkingSpot(userId: number) {
        return this.parkingService.checkIfUserHasSharedParkingSpot(userId, this.config);
    }

    releaseParkingSpotForUser(userId: number, date: string, sendEmail: boolean, releaseUserId: number) {
        return this.parkingService.releaseParkingSpotForUser(userId, date, sendEmail, releaseUserId, this.config);
    }

    ////////////// USER SERVICES /////////////////
    signIn(user: UserCredentials) {
        return this.userService.signIn(user, this.config);
    }

    getAllUsers() {
        return this.userService.getAllUsers(this.config);
    }

    getAllImpersonatedUsersByUser(userId:number) {
        return this.userService.getAllImpersonatedUsersByUser(userId, this.config);
    }

    getAllImpersonatedOnBehalfByUser(userId: number){
        return this.userService.getAllImpersonatedOnBehalfByUser(userId, this.config);
    }

    addImpersonatedUser(userId: number, impersonatedUserId: number) {
        return this.userService.addImpersonatedUser(userId, impersonatedUserId, this.config);
    }

    removeImpersonatedUser(userId: number, impersonatedUserId: number) {
        return this.userService.removeImpersonatedUser(userId, impersonatedUserId, this.config);
    }

    updatePassword(userId: number, newPassword: string) {
        return this.userService.updatePassword(userId, newPassword, this.config);
    }

    getUserById(userId: number) {
        return this.userService.getUserById(userId, this.config)
    }

}