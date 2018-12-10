import { catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {    

    constructor(private _storage: Storage) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {        
        let promise = this._storage.get('token_id');

        return Observable.fromPromise(promise).mergeMap(token => {
            let clonedRequest = this.addToken(request, token);
            
            return next.handle(clonedRequest).pipe(
                catchError(error => {
                    return _throw(error);
                })
            )
        })
    }

    private addToken(request: HttpRequest<any>, token: any) {        
        if (token) {            
            let clone: HttpRequest<any>;
            clone = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`                    
                }
            });
            return clone;
        }
 
        return request;
    }
}