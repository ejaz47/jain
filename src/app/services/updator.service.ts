import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Zip } from '@ionic-native/zip/ngx';

@Injectable({
  providedIn: 'root'
})
export class UpdatorService {

	private json_url: string;
	private zip_url: string;
  private installed_version: number = 0;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  httpParams: any = {
  	'current_version': this.installed_version
  };

  constructor(private http: HttpClient, 
  						private storage: Storage,
  						private transfer: FileTransfer,
  						private zip: Zip,
  						private file: File) { }

  private fileTransfer: FileTransferObject = this.transfer.create();

  isUpdateAvailable(): Promise<boolean>{
  	return new Promise((resolve, reject) => {
  		this.checkUpdate().subscribe(resp => {
  			if(resp.latest){
  				// wether installed version is smaller than latest
  				this.installed_version < parseInt(resp.latest) ?
  					resolve(true) : resolve(false);
  				return;
  			}else{
					reject(new Error('"latest" key not found in server json'));
  			}
  		}, err =>{
  			reject(err);
  		});
  	});
  }

  updateNow(): Promise<any>{
  	return new Promise((resolve, reject) => {
	  	this.fileTransfer.download(this.zip_url, this.file.dataDirectory + 'web.zip', true).then((entry) => {
		    console.log('download complete: ' + entry.toURL());

		    // unzip 
		    this.zip.unzip(this.file.dataDirectory + 'web.zip', this.file.dataDirectory + 'web', (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
				.then((result) => {
				  if(result === 0){
				  	// done
				  	resolve(true);
				  }else{
				  	// faild
				  }
				});

		  }, (error) => {
		    // handle error
		    reject(error);
		  });

	  });
  }

  // private methods
 	private checkUpdate(): Observable<any>{
    return this.http
      .post(this.json_url, this.httpParams, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // Handle API errors
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError('Error while http request.');
  };

}
