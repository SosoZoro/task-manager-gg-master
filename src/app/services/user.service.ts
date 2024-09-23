import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://monkfish-app-9x56s.ondigitalocean.app/v1/users';

  constructor(private http: HttpClient, private authService: AuthService) { }

  public getAllUsers(): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token used for getAllUsers:', token ? 'Token exists' : 'No token');
    const headers = new HttpHeaders({
      'x-access-token': token || "",
    });
    return this.http.get(`${this.apiUrl}/all`, { headers }).pipe(
      tap(response => {
        console.log('Raw getAllUsers response:', response);
        console.log('Response type:', typeof response);
        if (typeof response === 'object') {
          console.log('Response keys:', Object.keys(response));
        }
      }),
      catchError(error => {
        console.error('Error in getAllUsers:', error);
        return throwError(error);
      })
    );
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {email, password}).pipe(
      tap(response => console.log('login response:', JSON.stringify(response))),
      catchError(error => {
        console.error('Error in login:', error);
        throw error;
      })
    );
  }

  public signup(email: string, password: string, name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, {email, password, name}).pipe(
      tap(response => console.log('signup response:', JSON.stringify(response))),
      catchError(error => {
        console.error('Error in signup:', error);
        throw error;
      })
    );
  }
}