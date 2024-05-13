import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, delay, Observable, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {
  private apiUrl: string = '/api/puzzle';

  private solution: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

  public getRules(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}).pipe(
      catchError(this.handleError<any>('getRules', []))
    );
  }

  public sendRules(rules: string[][], words: string[]): Observable<string[][]> {
    return this.http.post<any>(this.apiUrl, { grid: rules, words: words }, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}).pipe(
      tap(value => {
        this.solution.next(value);
      }),
      catchError(this.handleError<any>('sendRules', []))
    );
  }

  public getSolution(): Observable<any> {
    return this.solution;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
