import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MyApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class PublisherService {
  private apiUrl = 'http://localhost:8177/publisher';

  constructor(private http: HttpClient) {}

  // Lấy danh sách tác giả
  getAllPublisher(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getAllPublisher?page=${page}&size=${size}`
    );
  }

  getAllPublisherByStatus(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getAllPublisherByStatus?page=${page}&size=${size}`
    );
  }

  //Tạo sản phẩm (FormData + Multipart)
  createPublisher(body: any): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/create`,
      body
    );
  }


  updatePublisher(id:number,body: any): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/updatePublisher?publisherId=${id}`,
      body
    );
  }


  // Đổi trạng thái product (Active/Inactive)
  changeStatus(id: number): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/changeStatusPublisher?publisherId=${id}`,
      {}
    );
  }

  getSearchAllPublisher(keyword: string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getSearchAllPublisher?keyword=${keyword}&page=${page}&size=${size}`,
    )
  }




}
