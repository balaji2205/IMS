import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>('http://localhost:5000/api/categories');
  }
  addCategory(category:any):Observable<any> {
    return this.http.post('http://localhost:5000/api/categories', category);

}
  deleteCategory(categoryId: string){
    return this.http.delete(`http://localhost:5000/api/categories/${categoryId}`)
  }

}
