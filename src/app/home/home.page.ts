import { Component } from '@angular/core';
import { AuthenticationService } from '../services/Authentication.service';
import { ActionSheetController  } from '@ionic/angular'
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActivatedRoute } from '@angular/router';
// import { File } from '@ionic-native/file/ngx';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {
	tickets = []	
	public user_id
	loaderAMm = true
	morePage=true
	public maximumPages
	
	page = 1;
	constructor(
		public authService: AuthenticationService,
		public actionSheetController: ActionSheetController,
		public route: ActivatedRoute,
		public camera: Camera
		) { 
			this.loadTickets();
		}
	loadTickets(infiniteScroll?) {
		this.authService.getHomeData(this.page)
		.subscribe(res => {
			this.tickets = this.tickets.concat(res['homeData']);
			res['total_pages'] ? this.maximumPages = res['total_pages'] : null
			if (infiniteScroll) infiniteScroll.target.complete()			
			this.loaderAMm = false
		})
	}
		
	loadMore(infiniteScroll) {
		this.page++;
		this.loadTickets(infiniteScroll);
		
		if (this.page === this.maximumPages) infiniteScroll.enable(false);
	}
	async doRefresh(event) {		
		this.loaderAMm = false
		await this.loadTickets()
		await event.target.complete();		
	}
	ionViewWillEnter(){
		this.route.params.subscribe(params => this.user_id = params['my_id'] )
	}
	async logoutUser(){
		this.authService.logout() 
	}
	goAdd(){
		this.authService.goAdd(this.user_id)
	}
}
