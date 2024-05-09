import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';

import { LoginRequest, LoginResponse } from './auth.types';
import { User } from '../user/user.types';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService
{
    private urlApiAuth: string = environment.BASE_URL;
    public _authenticated: boolean = false;

    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    set sessionTk(token: string)
    {
        localStorage.setItem('sessionTk', token);
    }

    get sessionTk(): string
    {
        return localStorage.getItem('sessionTk') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }


    signIn(credentials: LoginRequest): Observable<LoginResponse> {
      if (this._authenticated) {
          return throwError('El usuario ya ha ingresado');
      }

      return this._httpClient.post<LoginResponse>(this.urlApiAuth + '/login', credentials).pipe(
          switchMap((response: LoginResponse) => {
              this.accessToken = response.access_token;
              this._authenticated = true;
              //this._userService.user_session = response;
              return of(response);
          })
      );
  }

    signInUsingToken(): Observable<any>
    {
        // Sign in using the token
        return of(this.accessToken).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                //console.log('respose validate tk : ' + JSON.stringify(response));
                //if ( response.AccessToken )
                //{
                //    this.accessToken = response.AccessToken;
                //}

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                //this._userService.user_session = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userSession');
        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(request: User): Observable<User>
    {
        return this._httpClient.post<User>(this.urlApiAuth + '/user', request);
    }

    adminSignUp(user: User): Observable<User>
    {
        return this._httpClient.post<User>(this.urlApiAuth + 'AdminSignUp', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        //if ( AuthUtils.isTokenExpired(this.accessToken) )
        //{
        //    return of(false);
        //}

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
