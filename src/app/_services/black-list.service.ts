import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MyApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class BlackListService {
  private apiUrl = 'http://localhost:8177/blacklist';

  constructor(private http: HttpClient) {}

  // Lấy danh sách blacklist
  getAllBlackList(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getAll?page=${page}&size=${size}`
    );
  }

  //Thêm người dùng vào black list
  createBlackList(body: any): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/create`,
      body
    );
  }

  //Cập nhật black list
  updateBlackList(body: any): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/update`,
      body
    );
  }



  // Xoá tài khoản khỏi black list
  deleteBlackList(userCode: string): Observable<MyApiResponse<any>> {
    return this.http.delete<MyApiResponse<any>>(
      `${this.apiUrl}/delete`,
      { params: { userCode } }
    );
  }

  getSearchAllUserBlackList(keyword: string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getSearchAllBlackList?keyword=${keyword}&page=${page}&size=${size}`,
    )
  }





}
