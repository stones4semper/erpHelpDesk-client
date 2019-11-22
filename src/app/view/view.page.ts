import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/Authentication.service';
import { ActivatedRoute } from '@angular/router';


@Component({
	selector: 'app-view',
	templateUrl: './view.page.html',
	styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
	public my_id
	public dey_id
	public viewData:any
	loaderAMm = true
	constructor(
		public authService: AuthenticationService,		
		public route: ActivatedRoute
		) { }

	ngOnInit() {
		this.route.params.subscribe((params) => {
			this.my_id = params['my_id']
			this.dey_id = params['id'] 
			this.loadViewPage()		
		})
	}
	goEditPage(){
		this.authService.goEditPaged(this.my_id, this.dey_id)
	}
	async doRefresh(event) {
		await this.loadViewPage()
		await event.target.complete();		
	}
	goHome(){
		this.authService.goHome(this.my_id)
	}
	goAdd(){
		this.authService.goAdd(this.my_id)
	}
	async logoutUser(){
		this.authService.logout() 
	}
	loadViewPage(){
		this.loaderAMm=true
		this.authService.getView(this.dey_id, this.my_id).subscribe(data => { 
			this.viewData = JSON.parse(JSON.stringify(data)).viewData
			this.loaderAMm=false
		},(error) => {
			this.authService.showError(error)
			this.loaderAMm=false
		})
	}
}
