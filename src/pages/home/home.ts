import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { IndividualPage } from "../individual/individual";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  individualPage = IndividualPage;

  constructor(public navCtrl: NavController) {}
}
