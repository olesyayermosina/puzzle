import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl: string = '/api/user/login';
  private signupUrl: string = '/api/user/signup';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private user: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  public getAuthenticated(): Observable<any> {
    return this.user;
  }

  public login(user: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, {name: user.login, password: user.password}, this.httpOptions).pipe(
      tap(res => {
        this.user.next({token: res.token});
        localStorage.setItem('token', res.token)
      }),
      catchError(this.handleError<any>('login', []))
    );
  }

  public signup(user: any): Observable<any> {
    return this.http.post<any>(this.signupUrl, {name: user.login, password: user.password}, this.httpOptions).pipe(
      catchError(this.handleError<any>('signup', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
