import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';  // URL to the mock API

  constructor(private readonly http: HttpClient) { }

  public getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  public getUserById(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}`);
  }

  public createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  public updateUser(id: number, updatedUser: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedUser);
  }

  public deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
