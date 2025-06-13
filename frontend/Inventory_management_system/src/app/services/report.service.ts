import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


 

@Injectable({

 providedIn: 'root'

})

export class ReportService {

 private baseUrl = 'http://localhost:5000/api/report';  // Adjust if your backend runs on another port


 

 constructor(private http: HttpClient) {}


 

 // Get all report filenames (e.g., ['stock-report-1.html', 'stock-report-2.html'])

 getAllReports(): Observable<string[]> {

   return this.http.get<string[]>(`${this.baseUrl}/reports`);

 }


 

 // Download the HTML file directly as a blob (not used in jsPDF)

 downloadReport(filename: string): Observable<Blob> {

   return this.http.get(`${this.baseUrl}/reports/${filename}`, {

     responseType: 'blob'

   });

 }


 

 // Fetch raw HTML content as string for jsPDF conversion

 getHtmlContent(): Observable<string> {

   return this.http.get(`${this.baseUrl}/stock`, {

     responseType: 'text'

   });

 }

}





