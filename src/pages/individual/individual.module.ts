import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndividualPage } from './individual';

@NgModule({
  declarations: [
    IndividualPage,
  ],
  imports: [
    IonicPageModule.forChild(IndividualPage),
  ],
})
export class IndividualPageModule {}
