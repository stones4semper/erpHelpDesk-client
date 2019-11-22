import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/Authentication.service';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular'
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalPage } from '../modal/modal.page';
// import { File } from '@ionic-native/file/ngx';

@Component({
	selector: 'app-add',
	templateUrl: 'add.page.html',
	styleUrls: ['add.page.scss'],
})
export class AddPage implements OnInit {
	theData:any 
	partner_id={'id':'', 'name':''}
	user_ticket_group_id={'id':'', 'name':''}
	category_id={'id':'', 'name':''}
	base_station_maint_id={'id':'', 'name':''}
	region_id={'id':'', 'name':''}
	services={'id':'', 'name':''}
	base64Image:any
	picture:any
	public user_id
	public islog
	public input
	loaderAMm = true
	
	constructor(
		public router: Router,
		public authService: AuthenticationService,
		public actionSheetController: ActionSheetController,
		public route: ActivatedRoute,
 		public modalController: ModalController,
		public camera: Camera
		) { }
	
	ngOnInit(){		
		this.route.params.subscribe((params) => {
			this.user_id = params['my_id']
			this.loaderAMm=false
		})
	}
	
	async CreateTicket(formdata){
		this.islog =true
		formdata.value.user_id = this.user_id
		await this.authService.CreateTicket(formdata.value)
		this.islog =false
	}

	async OpenModal(data) { 
		const modal = await this.modalController.create({
			component: ModalPage,
			componentProps: {
			  'deyData': data,
			}
		});
		modal.onDidDismiss().then((data) => {
			let newDAta = data['data']
			if(newDAta['input'] === 'kin_ticket_category') this.category_id = newDAta['data']
			else if(newDAta['input'] === 'user_ticket_group') this.user_ticket_group_id = newDAta['data']
			else if(newDAta['input'] === 'res_partner') this.partner_id = newDAta['data']
			else if(newDAta['input'] === 'product_template') this.services = newDAta['data']
			else if(newDAta['input'] === 'base_station') this.base_station_maint_id = newDAta['data']
			else if(newDAta['input'] === 'kkon_region') this.region_id = newDAta['data']
			else console.log(newDAta['input'])
		});  
		return await modal.present();
	}
	
	pickImage(sourceType) {
		const options: CameraOptions = {
		  quality: 100,
		  sourceType: sourceType,
		  destinationType: this.camera.DestinationType.FILE_URI,
		  encodingType: this.camera.EncodingType.JPEG,
		  mediaType: this.camera.MediaType.PICTURE
		}
		this.camera.getPicture(options).then((imageData) => {
			this.base64Image = 'data:image/jpeg;base64,'+imageData;
			this.picture = imageData;
		}, err => console.log(err)); 
	}

	async selectImage() {
		const actionSheet = await this.actionSheetController.create({
			header: "Select Image source",
			buttons: [{
				text: 'Load from Library',
				handler: () => this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY)
			}, {
				text: 'Use Camera', 
				handler: () => this.pickImage(this.camera.PictureSourceType.CAMERA)
			}, { text: 'Cancel', role: 'cancel' }]
		});
		await actionSheet.present()
	}
	
	async logoutUser(){
		this.authService.logout() 
	}
}

