import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PopoverOptionsPage } from './popover-options'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: PopoverOptionsPage
      }
    ])
  ],
  declarations: [PopoverOptionsPage]
})
export class PopoverOptionsPageModule {}