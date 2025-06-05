import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users'; 

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/users');
  }

  createUser(userData: Partial<User> & { password: string }): Observable<any> {
    return this.http.post('http://localhost:5000/api/users', userData);
  }

  updateUser(id: string, updatedData: Partial<User>): Observable<any> {
    return this.http.put(`${'http://localhost:3000/api/users'}/${id}`, updatedData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${'http://localhost:5000/api/users'}/${id}`);
  }
}
