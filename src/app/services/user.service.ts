import { ChangePassword } from './../model/change-password';
import { HttpClient } from '@angular/common/http';
import { HttpConfig } from './../model/http-config';
import { Response } from '@angular/http';
import { Injectable } from "@angular/core";
import { UserCredentials } from './../model/user-credentials';
import { ImpersonateUser } from '../model/impersonate-user';

@Injectable()
export class UserService {
    constructor(private _http: HttpClient) { }

    getUserById(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/account/getUserById/${userId}`, { headers: config.headers }).map((response: Response) => { return response; });
    }

    getAllUsers(config: HttpConfig) {
        return this._http.get(`${config.domain}/api/user/GetAllUsers`, { headers: config.headers }).map((response: Response) => { return response; });
    }
    getAllImpersonatedUsersByUser(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/user/GetAllImpersonatedUsersByUser/${userId}`, { headers: config.headers }).map((response: Response) => { return response; });        
    }

    getAllImpersonatedOnBehalfByUser(userId: number, config: HttpConfig) {
        return this._http.get(`${config.domain}/api/user/GetAllImpersonatedOnBehalfByUser/${userId}`, { headers: config.headers }).map((response: Response) => { return response; });        
    }

    addImpersonatedUser(impersonateUser: ImpersonateUser, config: HttpConfig) {
        return this._http.post(`${config.domain}/api/user/AddImpersonatedUser`, impersonateUser, { headers: config.headers }).map((response: Response) => { return response; });                
    }

    removeImpersonatedUser(impersonateUser: ImpersonateUser,  config: HttpConfig) {
        return this._http.post(`${config.domain}/api/user/RemoveImpersonatedUser`, impersonateUser, { headers: config.headers }).map((response: Response) => { return response; });                
    }

    updatePassword(changePassword: ChangePassword, config: HttpConfig) {
        return this._http.post(`${config.domain}/api/user/UpdatePassword`, changePassword, { headers: config.headers }).map((response: Response) => { return response; });                        
    }

    signIn(user: UserCredentials, config: HttpConfig) {
        return this._http.post(`${config.domain}/api/account/Login`, { Username: user.email, Password: user.password }, { headers: config.headers }).map((response: Response) => { return response });                                
    }
}