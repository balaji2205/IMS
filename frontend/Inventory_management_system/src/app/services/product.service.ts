import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


 

@Injectable({ providedIn: 'root' })

export class ProductService {

  constructor(private http: HttpClient) {}


 

  getProductsByCategory(categoryName: string) {

    return this.http.get<any>(`http://localhost:5000/api/products/category/${categoryName}`);

  }


 

  getAllProducts() {

    return this.http.get<any>('http://localhost:5000/api/products');

    }


 

  addProduct(product: any) {

    return this.http.post(`http://localhost:5000/api/products`, product);

  }


 

//   updateCapacity(productId: string, capacity: number) {

//     return this.http.put(`http://localhost:5000/api/products/${productId}/capacity`, { capacity });

//   }

  updateCapacity(productId: string, payload: any) {

    return this.http.put<any>(`http://localhost:5000/api/products/${productId}/capacity`, payload);

  }




 

  deleteProduct(productId: string) {

    return this.http.delete(`http://localhost:5000/api/products/${productId}`);

  }


 

  // src/app/services/product.service.ts


 

updateMultipleProductStock(updates: { id: string; quantityChange: number }[]) {

  return this.http.put(`http://localhost:5000/api/products/update-stock`, updates);

}


 



}