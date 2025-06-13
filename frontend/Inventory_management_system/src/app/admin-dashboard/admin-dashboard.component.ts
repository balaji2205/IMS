import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../services/user.service';

import { OutletService } from '../services/outlet.service';

import { ReportService } from '../services/report.service';

import jsPDF from 'jspdf';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';


 

interface ExtendedOutlet {

 _id: string;

 name: string;

 location: string;

 manager: any;

 staff: any;

 managerName: string;

 staffName: string;

}


 

@Component({

 selector: 'app-admin-dashboard',

 templateUrl: './admin-dashboard.component.html',

 styleUrls: ['./admin-dashboard.component.css']

})

export class AdminDashboardComponent implements OnInit {

 // Forms

 userForm!: FormGroup;

 outletForm!: FormGroup;


 

 // UI flags

 showUserForm = false;

 showOutletForm = false;

 showUsers = true;

 showOutletList = false;

 showReports = false;


 

 // Data lists

 userList: any[] = [];

 filteredUsers: any[] = [];

 managerList: any[] = [];

 staffList: any[] = [];


 

 outletList: ExtendedOutlet[] = [];

 filteredOutlets: ExtendedOutlet[] = [];


 

 reportFiles: string[] = [];

 selectedReportContent = '';


 

 // States

 selectedRole = '';

 editingUserId: string | null = null;

 editingOutletId: string | null = null;


 

 // Search inputs

 searchQuery = '';

 outletSearchQuery = '';

 reportSearchQuery = '';


 

 constructor(

   private fb: FormBuilder,

   private userService: UserService,

   private outletService: OutletService,

   private reportService: ReportService,

   private http: HttpClient,

   private router: Router

 ) {}


 

 ngOnInit(): void {

   this.getAllUsers();

   this.getAllOutlets();

   this.loadReportFiles();

 }


 

 // --- USER FUNCTIONS ---


 

 getAllUsers() {

   this.userService.getUsers().subscribe(

     (users) => {

       this.userList = users;

       this.filteredUsers = users;

       this.managerList = users.filter(u => u.role === 'manager');

       this.staffList = users.filter(u => u.role === 'staff');

       console.log("asd",users);

       

     },

     error => console.error('Error fetching users:', error)

   );

 }


 

 showAddUserForm(role: string) {

   this.selectedRole = role;

   this.editingUserId = null;

   this.showUsers = false;

   this.showUserForm = true;

   this.showOutletForm = false;

   this.showReports = false;


 

   this.userForm = this.fb.group({

     username: ['', Validators.required],

     email: ['', [Validators.required, Validators.email]],

     role: [role, Validators.required],

     password: ['', Validators.required]

   });

 }


 

 onSubmitUser() {

   if (this.userForm.invalid) return;


 

   const userData = this.userForm.value;

   if (this.editingUserId) {

     this.userService.updateUser(this.editingUserId, userData).subscribe(() => {

       this.getAllUsers();

       this.cancelForm();

     });

   } else {

     this.userService.createUser(userData).subscribe(() => {

       this.getAllUsers();

       this.cancelForm();

     });

   }

 }


 

 editUser(user: any) {

   this.showUsers = false;

   this.showUserForm = true;

   this.showOutletForm = false;

   this.showReports = false;

   this.editingUserId = user._id;


 

   this.userForm = this.fb.group({

     username: [user.username, Validators.required],

     email: [user.email, [Validators.required, Validators.email]],

     role: [user.role, Validators.required],

     password: ['']

   });

 }


 

 confirmDelete(userId: string) {

   if (confirm('Are you sure you want to delete this user?')) {

     this.userService.deleteUser(userId).subscribe(() => {

       this.getAllUsers();

     });

   }

 }


 

 onSearch() {

   const query = this.searchQuery.toLowerCase();

   this.filteredUsers = this.userList.filter(user =>

     user.username.toLowerCase().includes(query) ||

     user.email.toLowerCase().includes(query) ||

     user.role.toLowerCase().includes(query)

   );

 }


 

 // --- OUTLET FUNCTIONS ---


 

 showAddOutletForm() {

   this.showOutletForm = true;

   this.showUsers = false;

   this.showUserForm = false;

   this.showReports = false;

   this.editingOutletId = null;


 

   this.outletForm = this.fb.group({

     name: ['', Validators.required],

     location: ['', Validators.required],

     manager: ['', Validators.required],

     staff: ['', Validators.required]

   });

 }


 

 getAllOutlets() {

    this.outletService.getAllOutlets().subscribe(

      (outlets) => {

        this.userService.getUsers().subscribe((users) => {

          const extendedOutlets: ExtendedOutlet[] = outlets.map((outlet: any) => {

            const managerUser = users.find(u => u._id === outlet.manager?._id);

            const staffUser = users.find(u => u._id === outlet.staff?._id);


 

            return {

              ...outlet,

              managerName: managerUser?.username || 'N/A',

              staffName: staffUser?.username || 'N/A'

            };

          });


 

          this.filteredOutlets = extendedOutlets;

          this.outletList = extendedOutlets;

          console.log('Fetched outlets:', this.outletList);  // <-- Log outlets after fetch

        });

      },

      error => console.error('Error fetching outlets:', error)

    );

  }


 

  onSubmitOutlet() {

    if (this.outletForm.invalid) {

      console.warn('Outlet form invalid:', this.outletForm.errors);

      return;

    }


 

    const outletData = this.outletForm.value;

    console.log('Submitting outlet data:', outletData, 'Editing outlet ID:', this.editingOutletId);


 

    if (this.editingOutletId) {

      this.outletService.updateOutlet(this.editingOutletId, outletData).subscribe({

        next: (updatedOutlet) => {

          console.log('Outlet updated successfully:', updatedOutlet);

          this.getAllOutlets(); // fetch updated outlets

          this.cancelForm();

        },

        error: (err) => {

          console.error('Failed to update outlet:', err);

          alert('Failed to save outlet changes.');

        }

      });

    } else {

      this.outletService.createOutlet(outletData).subscribe({

        next: (createdOutlet) => {

          console.log('Outlet created successfully:', createdOutlet);

          this.getAllOutlets();

          this.cancelForm();

        },

        error: (err) => {

          console.error('Failed to create outlet:', err);

          alert('Failed to create outlet.');

        }

      });

    }

  }

 toggleOutletList() {

   this.showOutletList = !this.showOutletList;

   this.showUsers = false;

   this.showUserForm = false;

   this.showOutletForm = false;

   this.showReports = false;

 }


 

 onOutletSearch() {

   const query = this.outletSearchQuery.toLowerCase();

   this.filteredOutlets = this.outletList.filter(outlet =>

     outlet.name.toLowerCase().includes(query) ||

     outlet.location.toLowerCase().includes(query)

   );

 }


 



 editOutlet(outlet: ExtendedOutlet) {

   this.showOutletForm = true;

   this.showUsers = false;

   this.showUserForm = false;

   this.showReports = false;

   this.editingOutletId = outlet._id;


 

   this.outletForm = this.fb.group({

     name: [outlet.name, Validators.required],

     location: [outlet.location, Validators.required],

     manager: [outlet.manager?._id || '', Validators.required],

     staff: [outlet.staff?._id || '', Validators.required]

   });

 }


 

 confirmDeleteOutlet(outletId: string) {

   if (confirm('Are you sure you want to delete this outlet?')) {

     this.outletService.deleteOutlet(outletId).subscribe(() => {

       this.getAllOutlets();

     });

   }

 }


 

 // --- COMMON ---


 

 cancelForm() {

   this.showUserForm = false;

   this.showOutletForm = false;

   this.showUsers = true;

   this.showReports = false;

   this.editingUserId = null;

   this.editingOutletId = null;

   this.selectedRole = '';

   this.userForm?.reset();

   this.outletForm?.reset();

 }


 

 // --- REPORTS SECTION ---


 

 showReportSection() {

   this.showReports = true;

   this.showUsers = false;

   this.showUserForm = false;

   this.showOutletForm = false;

   this.showOutletList = false;

 }


 

 loadReportFiles() {

   this.reportService.getAllReports().subscribe(

     (files: string[]) => {

       this.reportFiles = files;

     },

     error => console.error('Error fetching reports:', error)

   );

 }


 

 viewReport() {

   this.reportService.getHtmlContent().subscribe(

     (content: string) => {

       this.selectedReportContent = content;

       

       

     },

     error => {

       console.error('Error loading report content:', error);

       this.selectedReportContent = 'Failed to load report.';

     }

     

   );

   console.log("a");

   

 }


 

 downloadReportHTML() {

 fetch('http://localhost:5000/api/report/stock')

   .then(response => response.text())

   .then(htmlContent => {

     const blob = new Blob([htmlContent], { type: 'text/html' });

     const url = window.URL.createObjectURL(blob);


 

     const a = document.createElement('a');

     a.href = url;

     a.download = 'stock-report.html';

     document.body.appendChild(a);

     a.click();

     console.log("a");

     


 

     document.body.removeChild(a);

     window.URL.revokeObjectURL(url);

   });

}





 

 onReportSearch() {

   const query = this.reportSearchQuery.toLowerCase();

   this.reportFiles = this.reportFiles.filter(file => file.toLowerCase().includes(query));

 }


 

 logout() {

   sessionStorage.clear();

   localStorage.clear();       // Clear token and role

  // sessionStorage.clear();

  //  window.location.href = '/';

   this.router.navigate(['login/admin'])

 }


 

 toggleDropdown(event: Event) {

   event.stopPropagation();

   // Implement dropdown toggle logic here if needed

 }

}



 







