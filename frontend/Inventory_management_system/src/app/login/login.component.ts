import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
 selector: 'app-login',
 templateUrl: './login.component.html',
 styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 loginForm!: FormGroup;
 errorMessage: string = '';
 role: string = '';

 constructor(
   private fb: FormBuilder,
   private route: ActivatedRoute,
   private router: Router,
   private http: HttpClient
 ) {}

 ngOnInit(): void {
   this.role = this.route.snapshot.paramMap.get('role') || '';

   this.loginForm = this.fb.group({
     email: ['', [Validators.required, Validators.email]],
     password: ['', Validators.required]
   });
 }

 onSubmit(): void {
   if (this.loginForm.valid) {
     const { email, password } = this.loginForm.value;

     // Call the backend API
     this.http.post<any>('http://localhost:5000/api/auth/login', {
       email,
       password,
       role: this.role
     }).subscribe({
       next: (res) => {
         // Success: navigate to role-based dashboard
         this.router.navigate([`/dashboard/${this.role}`]);
       },
       error: (err) => {
         this.errorMessage = err.error?.message || 'Login failed. Please try again.';
       }
     });
   } else {
     this.errorMessage = 'Please fill in all fields correctly.';
   }
 }
}