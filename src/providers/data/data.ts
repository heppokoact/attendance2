import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AttendanceDto } from "./attendance-dto";
import { StoreServiceProvider } from "../store-service/store-service";
import { map } from "rxjs/operators";

@Injectable()
export class DataProvider {
  constructor(private http: HttpClient, private store: StoreServiceProvider) {}

  getAttendanceByEmpNo(empNo: string) {
    // サーバーでは0パディングで保存されているため、条件をそれに合わせる
    empNo = empNo.padStart(5, "0");

    return this.http
      .get<AttendanceDto>(`${this.store.remotePath}/attendance`, {
        params: new HttpParams().set("empNoFrom", empNo).set("empNoTo", empNo)
      })
      .pipe(map(attendances => attendances[0]));
  }

  updateAttendance(attendance: AttendanceDto) {
    return this.http.put(`${this.store.remotePath}/attendance`, attendance);
  }
}
