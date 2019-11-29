import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'login-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class LoginFormComponent implements OnInit {

	@Output() onsubmit = new EventEmitter();
	myForm: FormGroup;
	submitAttempt: boolean = false;

	constructor(private fb: FormBuilder, private translate: TranslateService) { }

	ngOnInit() {
		
		this.myForm = this.fb.group({
			age: ['', [
				Validators.required,
				Validators.maxLength(255)
			]],
			gender: ['', [
				Validators.required,
				Validators.maxLength(15)
			]],
			religion: ['', [
				Validators.required,
				Validators.maxLength(255),
			]],
			country: ['', [
				Validators.required,
				Validators.maxLength(255)
			]],
			state: ['', [
				Validators.required,
				Validators.maxLength(255)
			]],
			city: ['', [
				Validators.required,
				Validators.maxLength(255)
			]],
			contact: ['', [
				Validators.required,
				Validators.maxLength(15)
			]],
			sampraday: ['', [
				Validators.required,
				Validators.maxLength(255)
			]],
			qualification: ['', [
				Validators.required,
				Validators.maxLength(255)
			]],
			refered_by: ['', []],
	    });
	}

	onSubmit() {
		this.submitAttempt = true;
		this.onsubmit.emit(this.myForm.valid ? this.myForm.value : false);
	}

  updateLanguage(lan){
    console.log(lan);
	this.translate.use(lan);
  }
}
