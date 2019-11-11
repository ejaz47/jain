import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class LoginFormComponent implements OnInit {

	@Output() onsubmit = new EventEmitter();
	myForm: FormGroup;
	submitAttempt: boolean = false;

	constructor(private fb: FormBuilder) { }

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
			note: ['', []],
	    });
	}

	onSubmit() {
		this.submitAttempt = true;
		this.onsubmit.emit(this.myForm.valid ? this.myForm.value : false);
	}

}
