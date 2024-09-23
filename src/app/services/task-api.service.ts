import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  private apiUrl = 'https://monkfish-app-9x56s.ondigitalocean.app/v1/tasks';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Token used for API call:', token ? 'Token exists' : 'No token');
    return new HttpHeaders({
      'x-access-token': token || "",
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError('Something bad happened; please try again later.');
  }

  getTasksCreatedBy(userUid: string): Observable<any> {
    console.log('Fetching tasks created by user:', userUid);
    const headers = this.getHeaders();
    console.log('Headers:', headers);
    return this.http.get(`${this.apiUrl}/createdby/${userUid}`, { headers })
      .pipe(
        tap(response => console.log('Tasks created by user response:', response)),
        catchError(error => {
          console.error('Error fetching tasks created by user:', error);
          return throwError(error);
        })
      );
  }
  
  getTasksAssignedTo(userUid: string): Observable<any> {
    console.log('Fetching tasks assigned to user:', userUid);
    const headers = this.getHeaders();
    console.log('Headers:', headers);
    return this.http.get(`${this.apiUrl}/assignedto/${userUid}`, { headers })
      .pipe(
        tap(response => console.log('Tasks assigned to user response:', response)),
        catchError(error => {
          console.error('Error fetching tasks assigned to user:', error);
          return throwError(error);
        })
      );
  }

  updateTaskStatus(taskUid: string, done: boolean): Observable<any> {
    console.log(`Updating task status: ${taskUid}, done: ${done}`);
    const body = { done };
    return this.http.patch(`${this.apiUrl}/${taskUid}`, body, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Update task status response:', response)),
        catchError(this.handleError)
      );
  }

  deleteTask(taskUid: string): Observable<any> {
    console.log(`Deleting task: ${taskUid}`);
    return this.http.delete(`${this.apiUrl}/${taskUid}`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Delete task response:', response)),
        catchError(this.handleError)
      );
  }

  createTask(description: string, assignedToUid: string): Observable<any> {
    console.log(`Creating task: ${description}, assigned to: ${assignedToUid}`);
    const body = { description, assignedToUid };
    return this.http.post(this.apiUrl, body, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Create task response:', response)),
        catchError(this.handleError)
      );
  }
}