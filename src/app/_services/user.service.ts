import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface MyApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8177/user';

  constructor(private http: HttpClient) {
  }

  // Đăng nhập reader
  login(request: LoginRequest): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/loginReader`,
      request
    );
  }

  // Đăng nhập cms
  loginCms(request: LoginRequest): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/loginCms`,
      request
    );
  }

  // Lấy tất cả user
  getAllUser(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/all?page=${page}&size=${size}`
    );
  }

  getAllReader(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/allReader?page=${page}&size=${size}`
    );
  }

  getAllUserByRole(page: number, size: number, roleName: string): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/allUserByRoleName?page=${page}&size=${size}&roleName=${roleName}`
    );
  }


  // Lấy user theo token
  getUserByToken(token: string): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/userByToken?token=${token}`,
    );
  }

  getReaderByToken(token: string): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/readerByToken?token=${token}`,
    );
  }


  getUserByPublicId(publicId: string): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getUserByPublicId?publicId=${publicId}`
    );
  }

  getReaderByPublicId(publicId: string): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getReaderByPublicId?publicId=${publicId}`
    );
  }

  // Tạo user mới
  createUser(body: any): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(`${this.apiUrl}/create`, body);
  }

  createReader(body: any): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(`${this.apiUrl}/createReader`, body);
  }

  createReaderByUser(body: any): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(`${this.apiUrl}/createReaderByUser`, body);
  }


  // Cập nhật user theo TOKEN
  updateUser(body: any): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/update`,
      body
    );
  }


  updateReader(body: any): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/updateReader`,
      body
    );
  }


  updateUserByPublicId(body: any): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/updateByPublicId`,
      body
    );
  }

  updateReaderByPublicId(body: any): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/updateReaderByPublicId`,
      body
    );
  }

  // Xóa user theo TOKEN
  deleteUser(token: string): Observable<MyApiResponse<any>> {
    return this.http.delete<MyApiResponse<any>>(
      `${this.apiUrl}/delete/${token}`
    );
  }

  // Đổi trạng thái user (Active/Inactive)
  changeStatus(publicId: string): Observable<MyApiResponse<any>> {
    const token = localStorage.getItem('token');

    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/changeStatus?publicId=${publicId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }



  changeStatusReader(publicId: string): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/changeStatusReader?publicId=${publicId}`,
      {},
    );
  }

  // Cập nhật mật khẩu
  updatePassword(body: any): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/UpdatePassword`,
      body
    );
  }

  updateReaderPassword(body: any): Observable<MyApiResponse<any>> {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrl}/UpdateReaderPassword`,
      body
    );
  }

  //Đăng xuất
  logout(token: string): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/logout?token=${token}`,
      {}
    )
  }


  readerLogout(token: string): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/readerLogout?token=${token}`,
      {}
    )
  }


  getSearchAllUser(keyword: string, page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getSearchAllUser?keyword=${keyword}&page=${page}&size=${size}`,
    )
  }

  getSearchAllReader(keyword: string, page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getSearchAllReader?keyword=${keyword}&page=${page}&size=${size}`,
    )
  }


  sendResetPasswordLinkReader(email: string) {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/reader/reset-password/send-link?email=${email}`,
      {}
    );
  }

  resetPasswordReaderByToken(data: {
    token: string;
    newPassword: string;
  }) {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/reader/reset-password/confirm`,
      data
    );
  }


  sendResetPasswordLinkUser(email: string) {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/user/reset-password/send-link?email=${email}`,
      {}
    );
  }

  resetPasswordUserByToken(data: {
    token: string;
    newPassword: string;
  }) {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrl}/user/reset-password/confirm`,
      data
    );
  }






  // Lấy token hiện tại
  getToken(): string | null {
    return localStorage.getItem('token');
  }

// Lấy role hiện tại
  getRole(): string | null {
    return localStorage.getItem('role');
  }

// Kiểm tra đã login chưa
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

// Đăng xuất
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }


  changeRole(data: {
    publicId: string;
    targetRoles: string[];
  }): Observable<MyApiResponse<string>> {
    return this.http.post<MyApiResponse<string>>(
      `${this.apiUrl}/changeRole`,
      data
    );
  }




}
