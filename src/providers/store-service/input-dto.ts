import { AttendanceDto } from "../data/attendance-dto";
export class InputDto {
  /** サーバーから取得した出欠データ */
  attendance: AttendanceDto;

  /** 出欠状況 */
  attCat = "";
  /** 開封状況 */
  dispCat = "";
  /** 社員名称 */
  empName = "";
  /** 社員番号 */
  empNo = "";
  /** 所属名称 */
  grpName = "";
  /** 配布物名称 */
  handoutName = "";
  /** 配布状況 */
  handoutSitCat = "";
  /** プロジェクト名称 */
  pjName = "";
  /** 役職名称 */
  postName = "";
  /** 受取物名称 */
  rcptName = "";
  /** 受取状況 */
  rcptSitCat = "";
  /** 備考 */
  remCol = "";

  /** 詳細表示 */
  showDetail = false;
}
