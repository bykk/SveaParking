import { HttpConfig } from './../model/http-config';
import { Http, Response } from '@angular/http';
import { Injectable } from "@angular/core";
import { UtilsService } from './utils.service';
import { UserCredentials } from './../model/user-credentials';

@Injectable()
export class UserService {
    constructor(private _http: Http, private _utilityService: UtilsService) { }

    getUserById(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/account/getUserById/${userId}`, { headers: config.headers }).map((response: Response) => { return this._utilityService.convertToCamelCase(response.json()); });
    }

    getAllUsers(config: HttpConfig) {
        return this._http.get(`${config.domain}/api/user/GetAllUsers`, { headers: config.headers }).map((response: Response) => { return this._utilityService.convertToCamelCase(response.json()); });
    }
    getAllImpersonatedUsersByUser(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/user/GetAllImpersonatedUsersByUser/${userId}`, { headers: config.headers }).map((response: Response) => { return this._utilityService.convertToCamelCase(response.json()); });        
    }

    getAllImpersonatedOnBehalfByUser(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/user/GetAllImpersonatedOnBehalfByUser/${userId}`, { headers: config.headers }).map((response: Response) => { return this._utilityService.convertToCamelCase(response.json()); });        
    }

    addImpersonatedUser(userId: number, impersonatedUserId: number, config: HttpConfig) {
        return this._http.post(`${config.domain}/api/user/AddImpersonatedUser/${userId}/${impersonatedUserId}`, { headers: config.headers }).map((response: Response) => { return response.json(); });                
    }

    removeImpersonatedUser(userId: number, impersonatedUserId: number, config: HttpConfig) {
        return this._http.post(`${config.domain}/api/user/RemoveImpersonatedUser/${userId}/${impersonatedUserId}`, { headers: config.headers }).map((response: Response) => { return response.json(); });                
    }

    updatePassword(userId: number, newPassword: string, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/user/UpdatePassword/${userId}/${newPassword}`, { headers: config.headers }).map((response: Response) => { return response.json(); });                        
    }

    signIn(user: UserCredentials, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/account/GetAccount/${user.email}/${user.password}`, { headers: config.headers }).map((response: Response) => { return this._utilityService.convertToCamelCase(response.json()); });                                
    }
}