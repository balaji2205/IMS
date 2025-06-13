import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


 

// ✅ Define Outlet model

export interface Outlet {

 _id?: string;

 name: string;

 location: string;

 managerId?: string;

 staffIds?: string[];

}

export interface Manager {

  _id: string;

  name: string;

  email: string;

  // Add other manager fields here as needed

}



 

@Injectable({

 providedIn: 'root'

})

export class OutletService {

 private baseUrl = 'http://localhost:5000/api/outlets'; // Adjust if needed


 

 constructor(private http: HttpClient) {}


 

 // ✅ Get all outlets

 getAllOutlets(): Observable<Outlet[]> {

   return this.http.get<Outlet[]>(this.baseUrl);

 }


 

 // ✅ Get outlet by ID

 getOutletById(id: string): Observable<Outlet> {

   return this.http.get<Outlet>(`${this.baseUrl}/${id}`);

 }


 

 // ✅ Create new outlet

 createOutlet(outletData: Outlet): Observable<Outlet> {

   return this.http.post<Outlet>(this.baseUrl, outletData);

 }


 

 // ✅ Update outlet

 updateOutlet(id: string, outletData: Outlet): Observable<Outlet> {

   return this.http.put<Outlet>(`${this.baseUrl}/${id}`, outletData);

 }


 

 // ✅ Delete outlet

 deleteOutlet(id: string): Observable<any> {

   return this.http.delete(`${this.baseUrl}/${id}`);

 }

 // Inside OutletService

getManagerByOutletId(outletId: string): Observable<Manager> {

  return this.http.get<Manager>(`${this.baseUrl}/${outletId}/manager`);

}


 

getStaffByOutletId(outletId: string): Observable<any> {

  return this.http.get<any>(`${this.baseUrl}/${outletId}/staff`);

}



 

}



 










