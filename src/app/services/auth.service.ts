import { Storage } from '@ionic/storage';
import { HttpConfig } from '../model/http-config';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserCredentials } from '../model/user-credentials';

@Injectable()
export class AuthService {
    constructor(private _http: HttpClient, private _storage: Storage) {}

    login(userCredentials: UserCredentials, config: HttpConfig): Observable<any> {
        return this._http.post(
            `${config.domain}/api/auth/token`, 
            { Username: userCredentials.email, Password: userCredentials.password }, 
            { headers: config.headers }).map((response: Response) => { return response; });
    }

    logout() {
        this._storage.remove('token_id');
    }

    isAuthenticated() {
        this._storage.get('token_id').then((res) => {
            return res !== undefined;
        })
    }
}