import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
        noJwtError: true,
        tokenName: 'token',
        tokenGetter: (() => localStorage.getItem('token') || null),
        // globalHeaders: [{ 'Content-Type': 'application/x-www-form-urlencoded' }],
    }), http, options);
}

@NgModule({
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        }
    ]
})
export class AuthModule { }
