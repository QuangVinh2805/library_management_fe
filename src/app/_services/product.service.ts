import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface MyApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({providedIn: 'root'})
export class ProductService {
  private apiUrl = 'http://localhost:8177/product';

  constructor(private http: HttpClient) {
  }

  // Lấy tất cả sách
  getAllProduct(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getAllProduct?page=${page}&size=${size}`
    );
  }

  getAllProductByStatus(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getAllProductByStatus?page=${page}&size=${size}`
    );
  }

  //Tạo sản phẩm (FormData + Multipart)
  createProduct(formData: FormData): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/create`,
      formData
    );
  }


  //Cập nhật
  updateProduct(hashId: string, formData: FormData): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/update?hashId=${hashId}`,
      formData
    );
  }

  // Đổi trạng thái product (Active/Inactive)
  changeStatus(hashId: string): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/changeStatusProduct?hashId=${hashId}`,
      {}
    );
  }


  getProductByHashId(hashId: string): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getProductByHashId?hashId=${hashId}`,
    );
  }

  getAllNewProduct(): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getAllNewProduct`
    );
  }


  getAllProductCarouselByCategoryId(categoryId: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getProductCarouselByCategory?categoryId=${categoryId}`,
    );
  }

  getAllProductByCategoryId(categoryId: number,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getProductByCategory?categoryId=${categoryId}`,
    );
  }

  getAllProductByAuthorId(authorId: number,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getProductByAuthor?authorId=${authorId}`,
    );
  }

  getAllProductByPublisherId(publisherId: number,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getProductByPublisher?publisherId=${publisherId}`,
    );
  }

  getAllFavouriteProductByToken(token: string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getFavouriteProductByToken?token=${token}&page=${page}&size=${size}`,
    );
  }

  getSearchProductByStatus(keyword: string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/searchProductByStatus?keyword=${keyword}&page=${page}&size=${size}`,
    )
  }

  getSearchAllProduct(keyword: string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/searchAllProduct?keyword=${keyword}&page=${page}&size=${size}`,
    )
  }

  getSearchAllProductByStatus(keyword: string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/searchAllProductByStatus?keyword=${keyword}&page=${page}&size=${size}`,
    )
  }

  getProductCountByCategory(categoryId: number): Observable<MyApiResponse<string>> {
    return this.http.get<MyApiResponse<string>>(
      `${this.apiUrl}/countByCategory?categoryId=${categoryId}`,);
  }

  getProductCountByAuthor(authorId: number): Observable<MyApiResponse<string>> {
    return this.http.get<MyApiResponse<string>>(
      `${this.apiUrl}/countByAuthor?authorId=${authorId}`,);
  }

  getProductCountByPublisher(publisherId: number): Observable<MyApiResponse<string>> {
    return this.http.get<MyApiResponse<string>>(
      `${this.apiUrl}/countByPublisher?publisherId=${publisherId}`,);
  }


  createFavouriteProduct(body: any): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/create/favouriteProduct`,
      body
    )
  }


  getFavouriteProductCountByHashId(hashId: string): Observable<MyApiResponse<number>> {
    return this.http.get<MyApiResponse<number>>(
      `${this.apiUrl}/countFavourite?hashId=${hashId}`,
    );
  }

  changeStatusFavouriteProduct(id: number): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/changeStatusFavouriteProduct?favouriteProductId=${id}`,
      {}
    );
  }

  checkUserFavourite(hashId: string, token?: string): Observable<MyApiResponse<any>> {
    let url = `${this.apiUrl}/check-favourite?hashId=${hashId}`;
    if (token) {
      url += `&token=${token}`;
    }
    return this.http.get<MyApiResponse<any>>(url);
  }


  createProductReservation(body: any): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/createProductReservation`,
      body
    );
  }

  getAllProductReservationByUser(token: string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getAllProductReservationByUser?token=${token}&page=${page}&size=${size}`,
    )
  }

  getTopBorrowProduct(): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getTopBorrowProduct`
    );
  }


  getTopFavouriteProduct(): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getTopFavouriteProduct`
    );
  }


  getAllProductReservation(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getAllProductReservation?page=${page}&size=${size}`
    );
  }

  getSearchAllProductReservation(keyword:string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getSearchAllProductReservation?keyword=${keyword}&page=${page}&size=${size}`
    );
  }


  changeStatusProductReservation(borrowedProductId: number, newStatus: number): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/changeStatusProductReservation?productReservationId=${borrowedProductId}&newStatus=${newStatus}`,
      {}
    );
  }


  getBorrowStatistics(year: number): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/statistics/borrow?year=${year}`,
      {}
    );
  }

  getProductCountByMonth(): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(`${this.apiUrl}/countByMonth`);
  }

  searchProductReservation(
    type: string,
    start: string,
    end: string,
    page: number,
    size: number
  ): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/search?type=${type}&start=${start}&end=${end}&page=${page}&size=${size}`
    );
  }




}
