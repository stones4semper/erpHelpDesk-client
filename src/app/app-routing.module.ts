import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'home/:my_id', 
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    // canActivate: [AuthGuardService]
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'test', loadChildren: './test/test.module#TestPageModule' },
  { path: 'add/:my_id', loadChildren: './add/add.module#AddPageModule' },
  { path: 'edit/:my_id/:id', loadChildren: './edit/edit.module#EditPageModule' },
  { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' },
  { path: 'view/:my_id/:id', loadChildren: './view/view.module#ViewPageModule' } 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
