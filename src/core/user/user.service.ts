/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    catchError,
    map,
    Observable,
    of,
    ReplaySubject,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { User } from './user.types';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private urlApiAuth: string = environment.BASE_URL + '/user';
    private _user_session: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    private _user: BehaviorSubject<User > = new BehaviorSubject<User>(null);
    private _users: BehaviorSubject<User[] > = new BehaviorSubject<User[]>(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user_session(value: User) {
        // Store the value
        this._user_session.next(value);
        localStorage.setItem('userSession', JSON.stringify(value));
    }

    get user_session$(): Observable<User>
    {
        this._user_session.next(JSON.parse(localStorage.getItem('userSession')) as User);
        return this._user_session.asObservable();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Getter for user
     */
    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    /**
     * Getter for users
     */
    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    getUserSesion(): Observable<User> {
        const tk = localStorage.getItem('accessToken');
        const decode_tk = this._decodeToken(tk);
        return this._httpClient
            .get<User>(this.urlApiAuth + '/' + decode_tk.username)
            .pipe(
                tap((user) => {
                    this._user_session.next(user);
                })
            );
    }

    /**
     * Update the user_session
     *
     * @param user
     */
    updateUserSesion(user: User): Observable<any> {
        return this._httpClient.put<User>(this.urlApiAuth, { user }).pipe(
            map((response) => {
                this._user_session.next(response);
            })
        );
    }

    _decodeToken(token: string): any {
        try {
            const decodedToken = token;
            return decodedToken;
        } catch (error) {
            console.error('Error when decode token:', error);
        }

        return null;
    }

    /**
     * Get user by id
     */

    getusers(): Observable<User[]>
    {
        return this._httpClient.get<User[]>(this.urlApiAuth).pipe(
            switchMap((users: User[]) =>
            {
                this._users.next(users);
                return of(users);
            }),
            catchError((error: any) => {
              return of([]);
            }));
    }

    getUserById(id: string): Observable<User> {
        return this._httpClient.get<User>(this.urlApiAuth + '/' + id).pipe(
            take(1),
            switchMap((user: User) => {
                if (!user) {
                    return throwError(
                        'Could not found user with id of ' + id + '!'
                    );
                }
                this._user.next(user);
                this.updateUserInList(user);
                return of(user);
            })
        );
    }

    updateUser(id: number, user: User): Observable<User> {
        return this._httpClient.put<User>(this.urlApiAuth + '/' + id, user).pipe(
            take(1),
            switchMap((user: User) => {
                this._user.next(user);
                this.updateUserInList(user);
                return of(user);
            })
        );
    }

    deleteuser(id: string): Observable<any> {
        return this._httpClient.delete<any>(this.urlApiAuth + '/' +id).pipe(
            take(1),
            switchMap((data: any) => {
                this.updateUserInList(this.getUserByIdInList(+id));
                return of(data);
            })
        );
    }
    /**
     * Create user
     */
    createuser(user: User): Observable<User> {
        return this._httpClient.post<User>(this.urlApiAuth, user).pipe(
            take(1),
            switchMap((user: User) => {
                this._users.next([user, ...this._users.value]);
                return of(user);
            })
        );
    }

    /*
     *
     *Funciones auxiliares
     */

    // Función para actualizar un objeto User en la lista
    updateUserInList(updatedUser: User): void {
        const currentusers = this._users.getValue();

        if (currentusers) {
          const indice = currentusers.findIndex(group => group.id === updatedUser.id);
          if (indice !== -1) {
            currentusers[indice] = updatedUser;
              this._users.next([...currentusers]); // Emite una nueva lista actualizada
          } else {
              console.log(`No se encontró ningún user con el ID ${updatedUser.id}.`);
          }
      } else {
          console.log('La lista de grupos está vacía.');
      }
    }

    getUserByIdInList(id: number): User | null{
        const currentUsers = this._users.value;

        if (currentUsers) {
            this._users.value.map((user: User) => {
                if (user.id === id) {
                    return user;
                }
            });

            return null;
        }
    }
}
