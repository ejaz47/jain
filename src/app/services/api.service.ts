import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService{
	// API path
  base_path = 'http://softwarecompaniesinmumbai.com/jain_api/public/api/';
 
  constructor(private http: HttpClient, private storage: Storage) { }
  token: any;
  
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
 
  updateHttpOptions(token){
    this.token = token;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    }
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
      console.log(error);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
 
 
  // Create a new item
  getUserDetails(params): Observable<any>{
    return this.http
      .post(this.base_path + 'user-login', params, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  sendUserData(params): Observable<any>{
    return this.http
      .post(this.base_path + 'update-user', params, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  checkUpdate(params): Observable<any>{
    return this.http
      .post(this.base_path + 'check-version', params, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getDatabase(): Observable<any>{
    return this.http
      .post(this.base_path + 'get-master', {}, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  postAnswers(params): Observable<any>{
    this.syncInProgress = true;
    return this.http
      .post(this.base_path + 'add-answer', JSON.stringify(params), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  syncInProgress: boolean;

  syncAnswersInBackground(): Promise<any>{
    return new Promise((resolve, reject) => {
    if(!this.syncInProgress){
      this.storage.get('queue').then(que => {
        if(que){
          this.postAnswers({answers: que}).subscribe((resp) => {
            if(resp.success){
              this.storage.set('queue', null).then(que => {
                resolve(true);
              });
            }else{
              resolve(false);
            }

            this.syncInProgress = false;
          }, err => {
            resolve(false);
            this.syncInProgress = false;
          }); //subscribe end
        }else{
          resolve(true);
        }
      });
    }else{
      resolve(false);
    }
    });
  }

  logout(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.storage.clear().then(() => {
        resolve(true);
      }, err => {
        resolve(false);
      })
    });
  }
}
