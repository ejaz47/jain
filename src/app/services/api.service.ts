import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService{
	// API path
  base_path = 'http://localhost:3000/category';
 
  constructor(private http: HttpClient) { }
 
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
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
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
 
 
  // Create a new item
  getUserDetails(params): Observable<any>{
    // return this.http
    //   .post(this.base_path + '/login_gmail', params, this.httpOptions)
    //   .pipe(
    //     retry(2),
    //     catchError(this.handleError)
    //   )
    return new Observable((observer) => {
    	setTimeout(() => {
    		if(params.gmail_id == 'ejaz.portal@gmail.com'){
		    	observer.next({
		    		success: true,
		    		data: {
		    			token: 'bdgsjj38234bscd$$5k3333$###',
		    			age: 26,
		    			country: 'India',
							state: 'Maharashtra',
							city: 'Mumbai',
							sampraday: '',
							qualification: '',
							gmail: 'ejaz.portal@gmail.com'
		    		}
		    	});
    		}else{
    			observer.next({
		    		success: true,
		    		data: {
		    			token: 'bdgsjj38234bscd$$5k3333$###',
		    			age: '',
		    			country: '',
							state: '',
							city: '',
							sampraday: '',
							qualification: '',
							gmail: params.gmail_id
		    		}
		    	});
    		}
	    	observer.complete();
    	}, 2000);
    });
  }

  sendUserData(params): Observable<any>{
    // return this.http
    //   .post(this.base_path + '/user_data', params, this.httpOptions)
    //   .pipe(
    //     retry(2),
    //     catchError(this.handleError)
    //   )
    return new Observable((observer) => {
    	setTimeout(() => {
	    	observer.next({
	    		success: true,
	    		data: {}
	    	});
	    	observer.complete();
    	}, 2000);
    });
  }

}
