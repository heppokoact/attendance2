import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IndividualDto } from '../../providers/store-service/individual-dto';
import { StoreServiceProvider } from '../../providers/store-service/store-service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-individual',
  templateUrl: 'individual.html',
})
export class IndividualPage {

  /** テンキーの番号 */
  buttonNumbers = [7, 8, 9, 4, 5, 6, 1 ,2, 3, 0];

  v: IndividualDto;
  _v: Subscription;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public store: StoreServiceProvider) {
  }

  ionViewDidLoad() {
    this._v = this.store.individual.subscribe(v => {
      this.v = v;
    })
  }

  ionViewWillUnload() {
    this._v.unsubscribe();
  }

  pushNumber(num: number) {
    this.v.empNo += num;
  }

  pushBackspace() {
    let empNo = this.v.empNo;
    this.v.empNo = empNo.substring(0, empNo.length - 1);
  }

}
