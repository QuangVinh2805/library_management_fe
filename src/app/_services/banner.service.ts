import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MyApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class BannerService {
  private apiUrl = 'http://localhost:8177/banner';

  constructor(private http: HttpClient) {}

  getAllBanner(): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getAll`
    );
  }

  createBanner(formData: FormData): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/create`,
      formData
    );
  }


  updateBanner(id:number,body: any): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/update?bannerId=${id}`,
      body
    );

  }

  changeStatus(id: number): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/changeStatus?bannerId=${id}`,
      {}
    );
  }
}
