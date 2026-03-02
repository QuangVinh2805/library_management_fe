import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MyApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:8177/category';

  constructor(private http: HttpClient) {}

  // Lấy danh sách danh mục
  getAllCategory(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/all?page=${page}&size=${size}`
    );
  }
  getAllCategoryByStatus(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/allByStatus?page=${page}&size=${size}`
    );
  }

  //Tạo danh mục
  createCategory(body: any): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/create`,
      body
    );
  }

  //Cập nhật danh mục
  updateCategory(id:number,body: any): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/updateCategory?categoryId=${id}`,
      body
    );
  }


  // Đổi trạng thái danh mục (Active/Inactive)
  changeStatus(id: number): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/changeStatusCategory?categoryId=${id}`,
      {}
    );
  }

  getSearchAllCategory(keyword: string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getSearchAllCategory?keyword=${keyword}&page=${page}&size=${size}`,
    )
  }




}
