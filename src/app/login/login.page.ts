import { Component } from '@angular/core';
import { AuthenticationService } from '../services/Authentication.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'], 
})
export class LoginPage {
	public user_id
	
	constructor(
		public authService: AuthenticationService, 
	) { }

	ionViewWillEnter() {
		let sttt = localStorage.getItem("user_id")
		if(sttt) this.authService.goHome(sttt)
	}
	login(form){ 
		this.authService.login(JSON.stringify(form.value))
	}
} 
