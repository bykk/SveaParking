import { TakeParking } from './../model/take-parking';
import { ChangePassword } from './../model/change-password';
import { ReleaseParkingSpot } from './../model/release-parking-spot';
import { UserCredentials } from './../model/user-credentials';
import { HttpConfig } from '../model/http-config';
import { Headers } from '@angular/http';
import { Injectable, Injector } from "@angular/core";
import 'rxjs/add/operator/map';

import { ParkingService } from './parking.service';
import { AuthService } from './auth/auth.service';
import { UserService } from './user.service';
import { ImpersonateUser } from '../model/impersonate-user';

@Injectable()
export class FacadeService {
    private config: HttpConfig = {
        domain: 'http://sveaparkingtestapi.azurewebsites.net',
        headers: new Headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
            'Content-Type': 'application/json'
        })
    }; 

    private _parkingService: ParkingService;
    private _userService: UserService;
    private _authService: AuthService;

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

    public get authService(): AuthService {
        if(!this._userService) {
            this._authService = this._injector.get(AuthService);
        }
        return this._authService;
    }


    ////////////// AUTH SERVICE     //////////////
    login(userCredentials: UserCredentials) {
        return this.authService.login(userCredentials, this.config);
    }
    
    ////////////// PARKING SERVICES //////////////
    getAvailableParkingSpotsToday() {        
        return this.parkingService.getAvailableParkingSpotsToday(this.config);
    }

    getAvailableParkingSpotsTomorrow() {
        return this.parkingService.getAvailableParkingSpotsTomorrow(this.config);
    }

    takeParkingSpot(takeParking: TakeParking) {        
        return this.parkingService.takeParkingSpot(takeParking, this.config);
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

    releaseParkingSpotForUser(releaseParkingSpot: ReleaseParkingSpot) {
        return this.parkingService.releaseParkingSpotForUser(releaseParkingSpot, this.config);
    }

    checkIfParkingSpotIsReleased(userId: number, date: string) {
        return this.parkingService.checkIfParkingSpotIsReleased(userId, date, this.config);
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

    addImpersonatedUser(impersonateUser: ImpersonateUser) {
        return this.userService.addImpersonatedUser(impersonateUser, this.config);
    }

    removeImpersonatedUser(impersonateUser: ImpersonateUser) {
        return this.userService.removeImpersonatedUser(impersonateUser, this.config);
    }

    updatePassword(changePassword: ChangePassword) {
        return this.userService.updatePassword(changePassword, this.config);
    }

    getUserById(userId: number) {
        return this.userService.getUserById(userId, this.config)
    }

}