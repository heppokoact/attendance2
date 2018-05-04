import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { IndividualDto } from "./individual-dto";
import { InputDto } from "./input-dto";

@Injectable()
export class StoreServiceProvider {
  /** サーバーのパス */
  remotePath: string;

  /* マスタ */

  /* ViewModel */
  /** 個別検索画面のViewModel */
  individual = new BehaviorSubject(new IndividualDto());
  /** 出欠入力画面のViewModel */
  input = new BehaviorSubject(new InputDto());

  constructor() {}
}
