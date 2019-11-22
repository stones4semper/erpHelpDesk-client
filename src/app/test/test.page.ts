import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { PopoverOptionsPage } from "../popover-options/popover-options";
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { AuthenticationService } from '../services/Authentication.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
	selectedFile:File=null
	dey_id:any
	loaderAMm=true
	
	public imagePath;
	imgURL: any;
	public message: string;
	public headers = new HttpHeaders() 
		.set("Accept", 'application/json')
		.set('Content-Type', 'application/json' )


	
	popover: any;
	tabFabIcon: string = "text";
	optionType:string = "chat"; 
	constructor(
		public modalController: ModalController,	
		public authService: AuthenticationService,
		public http: HttpClient,		
		public popoverCtrl: PopoverController,
	) { }

	ngOnInit() { }
	
	preview(files) {
		if (files.length === 0)
		return;
	
		var mimeType = files.type;
		if (mimeType.match(/image\/*/) == null) {
			this.message = "Only images are supported.";
			return;
		}
	
		var reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files); 
		reader.onload = (_event) => { 
		this.imgURL = reader.result; 
		}
	}
	onFileSelected(event){
		this.selectedFile = <File>event.target.files[0]
		this.preview(this.selectedFile)
	}
	uploadFile(){
		const fd = new FormData()
		fd.append('image', this.selectedFile, this.selectedFile.name)
		this.http.post('http://localhost/ionic/myhelpdesk/upload.php', fd, {
			reportProgress:true,
			observe:'events'
		}).subscribe(event=>{
			let Nevent = JSON.parse(JSON.stringify(event))
			if(Nevent.type === HttpEventType.UploadProgress){
				console.log('Upload Progress: '+ Math.round(Nevent.loaded /Nevent.total * 100)+'%')
			} else if(Nevent.type === HttpEventType.Response){
				console.log(event)
			}
		})
	}
	async showPopover(ev: any) {
		const popover = await this.popoverCtrl.create({
		  component: PopoverOptionsPage,
		  event: ev,
		  translucent: true
		});
		return await popover.present();
	  }
}
