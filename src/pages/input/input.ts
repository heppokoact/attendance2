import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  ActionSheetController
} from "ionic-angular";
import { DataProvider } from "../../providers/data/data";
import { map, finalize } from "rxjs/operators";
import { StoreServiceProvider } from "../../providers/store-service/store-service";
import { InputDto } from "../../providers/store-service/input-dto";
import { Subscription } from "rxjs/Subscription";
import { zeroSuppress } from "../../utils/util";
import { AttCat, Handout, Rcpt, RemCol, Disp } from "../../utils/master";
import { IndividualDto } from "../../providers/store-service/individual-dto";

@Component({
  selector: "page-input",
  templateUrl: "input.html"
})
export class InputPage {
  /** 出欠状況マスタ */
  $AttCat = AttCat;
  /** 開封状況マスタ */
  $Disp = Disp;

  /** 出席以外のボタン */
  otherButtons = [
    { attCat: "0", name: "未記帳", color: "light" },
    { attCat: "2", name: "欠席", color: "danger" },
    { attCat: "3", name: "遅刻", color: "secondary" },
    { attCat: "4", name: "早退", color: "secondary" }
  ];

  /** Viewで使用する関数 */
  $zeroSuppress = zeroSuppress;

  /** ViewModl */
  v: InputDto;
  _v: Subscription;
  individualDto: IndividualDto;
  _individualDto: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    public store: StoreServiceProvider,
    private data: DataProvider
  ) {
    this._v = this.store.input.subscribe(v => (this.v = v));
    this._individualDto = this.store.individual.subscribe(
      v => (this.individualDto = v)
    );
  }

  /**
   * このページを表示可能かどうかを判定する。
   * 前ページから渡された社員番号が実在すれば表示可能
   */
  ionViewCanEnter() {
    console.log(this.$AttCat);
    // お待ち下さいを表示
    let loading = this.loadingCtrl.create({ content: "お待ち下さい..." });
    loading.present();

    // 社員番号に合致する出欠データを取得
    let empNo = this.navParams.get("empNo");
    return this.data
      .getAttendanceByEmpNo(empNo)
      .pipe(
        map(attendance => {
          console.log(attendance);
          if (!attendance) {
            let message = "指定した社員番号は存在しません。";
            this.alertCtrl.create({ title: "ERROR", message }).present();
            return false;
          }

          // ViewModelに取得結果をセット
          let newDto = Object.assign(new InputDto(), {
            attendance,
            ...attendance
          });
          this.store.input.next(newDto);

          return true;
        }),
        finalize(() => loading.dismiss())
      )
      .toPromise();
  }

  ionViewDidLoad() {}

  showHandoutList() {
    this.showActionSheet(Handout, handout => {
      this.v.handoutName = handout;
    });
  }

  showRcptList() {
    this.showActionSheet(Rcpt, rcpt => {
      this.v.rcptName = rcpt;
    });
  }

  showRemColList() {
    this.showActionSheet(RemCol, remCol => {
      if (this.v.remCol) {
        this.v.remCol = this.v.remCol + "\n" + remCol;
      } else {
        this.v.remCol = remCol;
      }
    });
  }

  /**
   * アクションシートを表示する
   * @param list 選択肢リスト
   * @param handler 選択肢を選択した時のアクション
   */
  showActionSheet(list: Array<string>, handler: (string) => void) {
    // 選択肢を作成
    let buttons = list.map(item => {
      return {
        text: item,
        handler: () => handler(item)
      };
    });

    this.actionSheetCtrl.create({ buttons }).present();
  }

  pushAttendance() {
    // 配布物・提出物が残っている場合は警告
    let messages = [];
    if (this.v.handoutName && this.v.handoutSitCat != "1") {
      messages.push("配布物が配布済になっていません。");
    }
    if (this.v.rcptName && this.v.rcptSitCat != "1") {
      messages.push("提出物が提出済になっていません。");
    }
    if (messages.length == 0) {
      this.register("1");
    } else {
      messages.push("処理を継続してよろしいですか？");
      let message = messages.join("\n");
      this.alertCtrl
        .create({
          title: "WARNING",
          message,
          buttons: [
            {
              text: "OK",
              handler: () => this.register("1")
            },
            {
              text: "CANCEL"
            }
          ]
        })
        .present();
    }
  }

  register(attCat: string) {
    // お待ち下さいを表示
    let loading = this.loadingCtrl.create({ content: "お待ち下さい..." });
    loading.present();

    // 登録処理
    this.data
      .updateAttendance({
        ...this.v.attendance,
        attCat,
        handoutName: this.v.handoutName,
        handoutSitCat: this.v.handoutSitCat,
        rcptName: this.v.rcptName,
        rcptSitCat: this.v.rcptSitCat,
        remCol: this.v.remCol
      })
      .subscribe(result => this.handleRegister(result), null, () =>
        loading.dismiss()
      );
  }

  private handleRegister(result: any) {
    // エラーの場合
    if (!result || result.statusCode != "200") {
      // エラーメッセージを作成
      let message = "予期せぬエラーが発生しました。";
      if (result.errors && result.errors.length > 0) {
        message = result.errors
          .map(error => `[${error.errorCode}]${error.errorMessage}`)
          .join("\n");
      }
      message += "\n" + JSON.stringify(result);
      // エラーメッセージを表示
      this.alertCtrl
        .create({
          title: `ERROR(${result.statusCode})`,
          message
        })
        .present();
      return;
    }

    // 正常の場合
    this.alertCtrl
      .create({
        title: "COMPLETE",
        message: "登録が完了しました。",
        buttons: [
          {
            text: "OK",
            handler: () => {
              this.individualDto.empNo = "";
              this.navCtrl.pop();
            }
          }
        ]
      })
      .present();
  }
}
