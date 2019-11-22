import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, Platform, LoadingController, ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';	
import { Observable } from 'rxjs';	


 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
    authState = new BehaviorSubject(false);
    // apiURL = 'http://localhost/angular-ionic/myhelpdesk/';
	apiURL = 'http://142.93.48.41/myhelpdesk/';
	
	islog = false
	public user_id=this.storage.get('user_id')
    constructor(
		public router: Router,
		public storage: Storage,
		public platform: Platform,
		public http: HttpClient,
		public loadingController: LoadingController,
		public modalController: ModalController,
		public toastCtrl: ToastController
    ) {
		this.platform.ready().then(() => this.ifLoggedIn());
    }
    public headers = new HttpHeaders() 
		.set("Accept", 'application/json')
		.set('Content-Type', 'application/json' )

	ifLoggedIn() {
		this.storage.get('user_id').then((response) => {
			// this.user_id
			if (response) this.authState.next(true)
		});
	}
  
    login(formData) {   
		this.islog =true
		this.http.post(`${this.apiURL}login.php`, formData, {headers:this.headers})
			.subscribe(async data => { 
				this.islog = false
				let ress = await JSON.parse(JSON.stringify(data))
				let toast = await this.toastCtrl.create({
					message: ress.msg,
					duration: 2000,
					color:ress.color,
				});
				await toast.present();
				await toast.onDidDismiss();
				console.log(JSON.parse(formData).remember)
				await this.storage.set('user_id', ress.user_id)
				if(ress.success && JSON.parse(formData).remember)  await localStorage.setItem('user_id', ress.user_id)
				ress.success ? await this.goHome(ress.user_id) : null 
			},error=>this.showError(error)  
		);
    } 

    async logout() {		
		const loading = await this.loadingController.create({
			message: 'Signing Out ',
			duration: 2000
		});
		await loading.present();
	
		const { role, data } = await loading.onDidDismiss();
		this.storage.remove('user_id').then(async () => {
			await localStorage.removeItem("user_id")
			this.router.navigate(['login']);
			this.authState.next(false);
		});
    }
  
	isAuthenticated() {
		return this.authState.value;
	} 

	getData(data, page) {    
		return this.http.post(`${this.apiURL}getData.php`, {'data':data, 'page': page}, {headers:this.headers});
	} 
	async showError(error){
		this.islog =false
		let toast = await this.toastCtrl.create({
			message: JSON.parse(JSON.stringify(error)).message, //'an error occured, pls try again later',
			duration: 3000,
			color:'danger'
		});
		await toast.present();
	}
	CreateTicket(formData){
		this.islog =true 
		this.http.post(`${this.apiURL}saveTicket.php`, formData, {headers:this.headers})
		.subscribe(async data => {
			console.log(data)
			this.islog =false
			let ress = await JSON.parse(JSON.stringify(data))
			let toast = await this.toastCtrl.create({
				message: ress.msg,
				duration: 3000,
				color:ress.color
			});
			await toast.present();
		},error => this.showError(error))
	}
	UpateTicket(formData){
		this.islog =true
		this.http.post(`${this.apiURL}updateTicket.php`, formData, {headers:this.headers})
		.subscribe(async data => {
			this.islog =false
			console.log(data)
			let ress = await JSON.parse(JSON.stringify(data))
			let toast = await this.toastCtrl.create({
				message: ress.msg,
				duration: 3000,
				color:ress.color
			});
			await toast.present();
		},error => this.showError(error))
	}
	getView(id, myid){		
		let newId = id+'-------'+myid
		return this.http.post(`${this.apiURL}getView.php`, {'id':newId}, {headers:this.headers})
	}
	goAdd(my_id){ 
		this.router.navigate(['add', my_id])
	}
	goHome(my_id){
		this.router.navigate(['home', my_id]);
	}
	goEditPaged(my_id, id){
		this.router.navigate(['edit', my_id, id ]);
	}
	getHomeData(page){
		return this.http.post(`${this.apiURL}getHomeData.php`, {'page':page}, {headers:this.headers});
	}
}