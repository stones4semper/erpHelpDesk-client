import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { Camera } from '@ionic-native/Camera/ngx';

import { AuthGuardService } from './services/auth-guard.service';
import { AuthenticationService } from './services/Authentication.service';
import { ModalPage } from './modal/modal.page';
import { ModalPageModule } from './modal/modal.module';
import { PopoverOptionsPage } from "./popover-options/popover-options";
import { PopoverOptionsPageModule } from "./popover-options/popover-options.module";

@NgModule({
	declarations: [
		AppComponent
	],
	entryComponents: [
		ModalPage,
		PopoverOptionsPage,
	],
	imports: [
		BrowserModule, 
		FormsModule,
		ReactiveFormsModule, 
		HttpClientModule,
		AppRoutingModule,
		IonicModule.forRoot(), 
		ModalPageModule,
		PopoverOptionsPageModule,
		IonicStorageModule.forRoot()
	],
	providers: [
		StatusBar,
		SplashScreen,
		AuthGuardService,
		AuthenticationService,
		HttpClientModule,
		Camera,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
