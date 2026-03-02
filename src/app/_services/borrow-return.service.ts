import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MyApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class BorrowReturnService {
  private apiUrlBorrow = 'http://localhost:8177/borrow';
  private apiUrlReturn = 'http://localhost:8177/return';
  private apiUrlFee = 'http://localhost:8177';


  constructor(private http: HttpClient) {}

  getAll(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlBorrow}/product/all?page=${page}&size=${size}`
    );
  }

  getSearchAll(keyword:string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlBorrow}/product/getSearchAll?keyword=${keyword}&page=${page}&size=${size}`
    );
  }


  getBorrowProductById(borrowedProductId: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlBorrow}/product/getOne?borrowedProductId=${borrowedProductId}`,
    );
  }

  createBorrow(request: {
    email: string;
    items: {
      hashId: string;
      quantity: number;
      dueDate: string;
    }[];
  }): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrlBorrow}/product`,
      request
    );
  }

  returnBook(request: { borrowedProductId: number; isLost: boolean | null }):
    Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrlReturn}/product`,
      request
    );
  }

  payFee(request: any): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrlFee}/fee/payment`,
      request
    );
  }

  searchBorrow(
    type: string,
    start: string,
    end: string,
    page: number,
    size: number
  ): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlBorrow}/search?type=${type}&start=${start}&end=${end}&page=${page}&size=${size}`
    );
  }




}
