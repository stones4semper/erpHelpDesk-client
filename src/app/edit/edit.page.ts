import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular'
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { AuthenticationService } from '../services/Authentication.service';
import { ModalPage } from '../modal/modal.page';

@Component({
	selector: 'app-edit',
	templateUrl: './edit.page.html',
	styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
	theData:any 
	partner_id={'id':'', 'name':''}
	user_ticket_group_id={'id':'', 'name':''}
	category_id={'id':'', 'name':''}
	base_station_maint_id={'id':'', 'name':''}
	location_id={'id':'', 'name':''}
	services={'id':'', 'name':''}
	olt_id={'id':'', 'name':''}
	installation_fse_id={'id':'', 'name':''}
	installation_approver_id={'id':'', 'name':''}
	region_id={'id':'', 'name':''}
	base64QA:any
	base64INS:any
	base64Rej:any
	installation_picture:any
	rejection_evidence:any
	qa_form:any
	public P_id
	public my_id
	viewData:any
	loaderAMm = true
	showErrowPage =false
	constructor(
		public authService: AuthenticationService,		
		public modalController: ModalController,
		public route: ActivatedRoute,
		public actionSheetController: ActionSheetController,
		public camera: Camera
		) { }
	
	ngOnInit(){
		this.route.params.subscribe((params) => {
			this.P_id = params['id']
			this.my_id = params['my_id']
			this.loadEditPage()		
		} )
	}
	async UpdateTicket(formdata){
		formdata.value.my_id = this.my_id
		formdata.value.P_id = this.P_id
		await this.authService.UpateTicket(formdata.value)
	}

	pickImage(sourceType, what) {
		const options: CameraOptions = {
		  quality: 100,
		  sourceType: sourceType,
		  destinationType: this.camera.DestinationType.FILE_URI,
		  encodingType: this.camera.EncodingType.JPEG,
		  mediaType: this.camera.MediaType.PICTURE
		}
		this.camera.getPicture(options).then((imageData) => {
			if(what == 'base64QA'){
				this.base64QA = 'data:image/jpeg;base64,'+imageData;
				this.qa_form = imageData;
			}	else if(what == 'base64INS'){
				this.base64INS = 'data:image/jpeg;base64,'+imageData;
				this.installation_picture = imageData;
			}	else if(what == 'base64Rej'){
				this.base64Rej = 'data:image/jpeg;base64,'+imageData;
				this.rejection_evidence = imageData;
			}	
		}, err => console.log(err)); 
	}

	async selectImage(what) {
		const actionSheet = await this.actionSheetController.create({
			header: "Select Image source",
			buttons: [{
				text: 'Load from Library',
				handler: () => this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY, what)
			}, {
				text: 'Use Camera', 
				handler: () => this.pickImage(this.camera.PictureSourceType.CAMERA, what)
			}, { text: 'Cancel', role: 'cancel' }]
		});
		await actionSheet.present()
	}

	async doRefresh(event) {
		await this.loadEditPage()
		await event.target.complete();		
	}
	loadEditPage(){
		this.loaderAMm=true
		this.authService.getView(this.P_id, this.my_id).subscribe(data => { 
			this.viewData = JSON.parse(JSON.stringify(data)).viewData
			if(this.viewData.partner_id) this.partner_id=this.viewData.partner_id
			if(this.viewData.user_ticket_group_id) this.user_ticket_group_id=this.viewData.user_ticket_group_id
			if(this.viewData.category_id) this.category_id=this.viewData.category_id
			if(this.viewData.base_station_maint_id) this.base_station_maint_id=this.viewData.base_station_maint_id
			if(this.viewData.location_id) this.location_id=this.viewData.location_id
			if(this.viewData.services) this.services=this.viewData.services
			if(this.viewData.installation_picture) this.installation_picture=this.viewData.installation_picture
			if(this.viewData.rejection_evidence) this.rejection_evidence=this.viewData.rejection_evidence
			if(this.viewData.qa_form) this.qa_form=this.viewData.qa_form
			
			if(this.viewData.olt_id) this.olt_id=this.viewData.olt_id
			if(this.viewData.installation_fse_id) this.installation_fse_id=this.viewData.installation_fse_id
			if(this.viewData.installation_approver_id) this.installation_approver_id=this.viewData.installation_approver_id
			if(this.viewData.region_id) this.region_id=this.viewData.region_id

			this.loaderAMm=false
		},(error) => {
			this.authService.showError(error)
			this.loaderAMm=false
			this.showErrowPage=true
		})
	}
	async OpenModal(data, dePar=0) {
		const modal = await this.modalController.create({
			component: ModalPage,
			componentProps: {
			  'deyData': data,
			}
		});
		modal.onDidDismiss().then((data) => {
			let newDAta = data['data']
			// console.log(newDAta)
			if(newDAta['input'] === 'kin_ticket_category') this.category_id = newDAta['data']
			else if(newDAta['input'] === 'user_ticket_group') this.user_ticket_group_id = newDAta['data']
			else if(newDAta['input'] === 'res_partner') this.partner_id = newDAta['data']
			else if(newDAta['input'] === 'product_template') this.services = newDAta['data']
			else if(newDAta['input'] === 'base_station') this.base_station_maint_id = newDAta['data']
			else if(newDAta['input'] === 'kkon_location') this.location_id = newDAta['data']
			else if(newDAta['input'] === 'kkon_olt') this.olt_id = newDAta['data']
			else if((newDAta['input'] === 'res_users') && (dePar == 1)) this.installation_fse_id = newDAta['data']
			else if((newDAta['input'] === 'res_users') && (dePar == 2)) this.installation_approver_id = newDAta['data']
			else if(newDAta['input'] === 'kkon_region') this.region_id = newDAta['data']
			else console.log('this.region_id')
			console.log(this.region_id)
		});  
		return await modal.present();
	}
	async logoutUser(){
		this.authService.logout() 
	}

	goAdd(){
		this.authService.goAdd(this.my_id)
	}	
	goHome(){
		this.authService.goHome(this.my_id)
	}

}
