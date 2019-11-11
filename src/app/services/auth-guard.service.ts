import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanDeactivate<boolean>{

  constructor() { }

  canDeactivate(): boolean{

  	return true;
  }
}
