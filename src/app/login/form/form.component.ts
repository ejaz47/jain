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
			username: ['', [
				Validators.required,
				Validators.maxLength(255)
			]],
			password: ['', [
				Validators.required,
				Validators.maxLength(50)
			]]
	    });
	}

	onSubmit() {
		this.submitAttempt = true;
		this.onsubmit.emit(this.myForm.valid ? this.myForm.value : false);
	}

}
