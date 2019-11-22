import { Component, Input, OnInit } from '@angular/core';
import {ModalController, IonInfiniteScroll, NavParams } from '@ionic/angular';
import { AuthenticationService } from '../services/Authentication.service';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.page.html',
	styleUrls: ['./modal.page.scss'],
  })
export class ModalPage  {
	gotDatas = []
	loaderAMm=true
	public data	
	public user_id
	morePage=true
	public maximumPages
	page = 1;
	public deyData

	constructor(
		private modalController: ModalController,
		public authService: AuthenticationService,
		navParams: NavParams
		) {
			this.deyData =navParams.get('deyData')
			this.loadDropdown();
		} 
	
	async dismiss() {
		this.modalController.dismiss({"input":this.deyData, "data":this.data})
	}
	setAm(data){
		this.data = data
		this.dismiss()
	}

	loadDropdown(infiniteScroll?) {
		this.authService.getData(this.deyData, this.page).subscribe(async data => {
			this.gotDatas = this.gotDatas.concat(data['returnDate']);
			data['total_pages'] ? this.maximumPages = data['total_pages'] : null
			if (infiniteScroll) infiniteScroll.target.complete()			
			this.loaderAMm = false

		}, error => console.log(error)) 
	}
		
	loadMore(infiniteScroll) {
		this.page++;
		this.loadDropdown(infiniteScroll);		
		if (this.page === this.maximumPages) infiniteScroll.enable(false);
	}
}