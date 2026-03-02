import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MyApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private apiUrl = 'http://localhost:8177/user';
  private apiUrlRole = 'http://localhost:8177/role';
  private apiUrlPermission = 'http://localhost:8177/permissions';
  private apiUrlRoute = 'http://localhost:8177/routes';
  private apiUrlAssign = 'http://localhost:8177/api/admin';



  constructor(private http: HttpClient) {
  }


  getAllRole(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlRole}/getAll?page=${page}&size=${size}`
    );
  }


  getAllPermission(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlPermission}/getAll?page=${page}&size=${size}`
    );
  }


  getAllRoute(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlRoute}/getAll?page=${page}&size=${size}`
    );
  }

  createRole(roleName: string) {
    return this.http.post(
      `${this.apiUrlRole}/create?roleName=${encodeURIComponent(roleName)}`,
      null
    );
  }


  updateRole(id: number, roleName: string) {
    return this.http.put(
      `${this.apiUrlRole}/update?id=${id}&roleName=${encodeURIComponent(roleName)}`,
      null
    );
  }



  changeStatusRole(id: number) {
    return this.http.put(
      `${this.apiUrlRole}/changeStatus?id=${id}`,
      null
    );
  }


  getSearchAllRole(keyword: string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlRole}/getSearchAllRole?keyword=${keyword}&page=${page}&size=${size}`,
    )
  }


  createRoute(body: any): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrlRoute}/create`,
      body
    );
  }

  updateRoute(id: number, body: any) {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrlRoute}/update?id=${id}`,
      body
    );
  }


  changeStatusRoute(id: number) {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrlRoute}/changeStatus?id=${id}`,
      null
    );
  }


  getSearchAllRoute(keyword: string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlRoute}/getSearchAllRoute?keyword=${keyword}&page=${page}&size=${size}`,
    )
  }


  createPermission(body: any): Observable<MyApiResponse<any>> {
    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrlPermission}/create`,
      body
    );
  }

  updatePermission(id: number, body: any) {
    return this.http.put<MyApiResponse<any>>(
      `${this.apiUrlPermission}/update?id=${id}`,
      body
    );
  }



  deletePermission(code: string) {
    return this.http.delete<MyApiResponse<any>>(
      `${this.apiUrlPermission}/delete?code=${encodeURIComponent(code)}`
    );
  }


  getSearchAllPermission(keyword: string,page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlPermission}/getSearchAllPermission?keyword=${keyword}&page=${page}&size=${size}`,
    )
  }

  getPermissionByRole(
    roleId: number,
    page: number,
    size: number
  ): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlPermission}/role/permissions`,
      {
        params: {
          roleId: roleId,
          page: page,
          size: size
        }
      }
    );
  }

  searchPermissionByRole(
    roleId: number,
    page: number,
    size: number,
    keyword: string
  ): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlAssign}/role/findPermissions`,
      {
        params: {
          roleId,
          page,
          size,
          keyword
        }
      }
    );

  }


  // getPermissionByUser(
  //   publicId: string,
  //   page: number,
  //   size: number
  // ): Observable<MyApiResponse<any>> {
  //   return this.http.get<MyApiResponse<any>>(
  //     `${this.apiUrlPermission}/user/permissions`,
  //     {
  //       params: {
  //         publicId: publicId,
  //         page: page,
  //         size: size
  //       }
  //     }
  //   );
  // }



  getAllUserByStatus(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrl}/getAllByStatus?page=${page}&size=${size}`
    );
  }

  getAllRoleByStatus(page: number, size: number): Observable<MyApiResponse<any>> {
    return this.http.get<MyApiResponse<any>>(
      `${this.apiUrlRole}/getAllByStatus?page=${page}&size=${size}`
    );
  }


  // assignPermissionToUser(
  //   publicId: string,
  //   permissionId: number
  // ): Observable<MyApiResponse<any>> {
  //
  //   return this.http.post<MyApiResponse<any>>(
  //     `${this.apiUrlAssign}/assign-permission/user`,
  //     null,
  //     {
  //       params: {
  //         publicId: publicId,
  //         permissionId: permissionId
  //       }
  //     }
  //   );
  // }


  assignPermissionToRole(
    roleId: number,
    permissionIds: number[]
  ): Observable<MyApiResponse<any>> {

    return this.http.post<MyApiResponse<any>>(
      `${this.apiUrlAssign}/assign-permission/role`,
      {
        roleId,
        permissionIds
      }
    );
  }


  removePermissionFromRole(
    roleId: number,
    permissionId: number
  ): Observable<MyApiResponse<any>> {
    return this.http.delete<MyApiResponse<any>>(
      `${this.apiUrlPermission}/role/permissions/remove`,
      {
        params: {
          roleId: roleId,
          permissionId: permissionId
        }
      }
    );
  }

  // removePermissionFromUser(
  //   publicId: string,
  //   permissionId: number
  // ): Observable<MyApiResponse<any>> {
  //   return this.http.delete<MyApiResponse<any>>(
  //     `${this.apiUrlPermission}/user/permissions/remove`,
  //     {
  //       params: {
  //         publicId: publicId,
  //         permissionId: permissionId
  //       }
  //     }
  //   );
  // }


  SearchPermissionByRole(
    roleId: number,
    keyword: string,
    page: number,
    size: number
  ): Observable<any> {

    let params: any = {
      roleId,
      page,
      size
    };

    if (keyword && keyword.trim() !== '') {
      params.keyword = keyword;
    }

    return this.http.get<any>(
      `${this.apiUrlAssign}/role/findPermissions`,
      { params }
    );
  }



}
