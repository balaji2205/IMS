// import { Component, OnInit, HostListener } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { UserService, User } from 'src/app/services/user.service';
// import { OutletService, Outlet } from 'src/app/services/outlet.service';

// @Component({
//  selector: 'app-admin-dashboard',
//  templateUrl: './admin-dashboard.component.html',
//  styleUrls: ['./admin-dashboard.component.css']
// })
// export class AdminDashboardComponent implements OnInit {
//  dropdownOpen = false;
//  searchQuery = '';
//  showUserForm = false;
//  currentRole: string = '';

//  // Users
//  users: User[] = [];
//  filteredUsers: User[] = [];

//  // Outlets
//  outlets: Outlet[] = [];
//  filteredOutlets: Outlet[] = [];
//  outletSearchQuery: string = '';
//  showOutletList: boolean = false;
//  showUsers: boolean = true;
//  showOutletForm: boolean = false;

//  editingOutletId: string | null = null;

//  // Forms
//  userForm: FormGroup;
//  outletForm: FormGroup;

//  constructor(
//    private router: Router,
//    private fb: FormBuilder,
//    private userService: UserService,
//    private outletService: OutletService
//  ) {
//    this.userForm = this.fb.group({
//      username: ['', Validators.required],
//      email: ['', [Validators.required, Validators.email]],
//      role: ['', Validators.required],
//      password: ['', Validators.required]
//    });

//    this.outletForm = this.fb.group({
//      name: ['', Validators.required],
//      location: ['', Validators.required]
//    });
//  }

//  ngOnInit(): void {
//    this.loadUsers();
//    this.loadOutlets();
//  }

//  // ========== USER ==========
//  loadUsers(): void {
//    this.userService.getUsers().subscribe(users => {
//      this.users = users;
//      this.filteredUsers = [...users];
//    });
//  }

//  onSearch(): void {
//    const query = this.searchQuery.toLowerCase().trim();
//    this.filteredUsers = query
//      ? this.users.filter(user =>
//          user.username.toLowerCase().includes(query) ||
//          user.email.toLowerCase().includes(query)
//        )
//      : [...this.users];
//  }

//  confirmDelete(userId: string | undefined): void {
//    if (!userId) return;
//    if (window.confirm("Are you sure you want to delete this user?")) {
//      this.userService.deleteUser(userId).subscribe(() => {
//        this.loadUsers();
//      });
//    }
//  }

//  editUser(user: User): void {
//    this.showUserForm = true;
//    this.currentRole = user.role;
//    this.userForm.patchValue({
//      username: user.username,
//      email: user.email,
//      role: user.role,
//      password: '' // blank on edit
//    });
//  }

//  showAddUserForm(role: string): void {
//    this.currentRole = role;
//    this.userForm.reset();
//    this.userForm.patchValue({ role });
//    this.showUserForm = true;
//  }

//  onSubmit(): void {
//    if (this.userForm.valid) {
//      const formValue = this.userForm.value;
//      const userData = {
//        username: formValue.username,
//        email: formValue.email,
//        role: formValue.role,
//        password: formValue.password,
//        isActive: true
//      };
//      this.userService.createUser(userData).subscribe(() => {
//        alert(`${formValue.role} added successfully.`);
//        this.loadUsers();
//        this.showUserForm = false;
//      }, () => {
//        alert('Failed to add user.');
//      });
//    } else {
//      alert('Please fill all fields.');
//    }
//  }

//  onSubmitUser(): void {
//    this.onSubmit();
//  }

//  // ========== OUTLET ==========
//  loadOutlets(): void {
//    this.outletService.getAllOutlets().subscribe(data => {
//      this.outlets = data;
//      this.filteredOutlets = [...data];
//    });
//  }

//  toggleOutletList(): void {
//    this.showOutletList = !this.showOutletList;
//    this.showUsers = !this.showOutletList;
//    this.showOutletForm = false;
//  }

//  onOutletSearch(): void {
//    const query = this.outletSearchQuery.toLowerCase().trim();
//    this.filteredOutlets = !query
//      ? [...this.outlets]
//      : this.outlets.filter(outlet =>
//          outlet.name.toLowerCase().includes(query) ||
//          outlet.location.toLowerCase().includes(query)
//        );
//  }

//  showAddOutletForm(): void {
//    this.editingOutletId = null;
//    this.outletForm.reset();
//    this.showOutletForm = true;
//  }

//  editOutlet(outlet: Outlet): void {
//    this.editingOutletId = outlet._id ?? null;
//    this.outletForm.patchValue({
//      name: outlet.name,
//      location: outlet.location
//    });
//    this.showOutletForm = true;
//  }

//  cancelForm(): void {
//    this.showUserForm = false;
//    this.showOutletForm = false;
//  }

//  onSubmitOutlet(): void {
//    if (this.outletForm.valid) {
//      const outletData = this.outletForm.value;

//      if (this.editingOutletId) {
//        this.outletService.updateOutlet(this.editingOutletId, outletData).subscribe(() => {
//          alert('Outlet updated.');
//          this.loadOutlets();
//          this.showOutletForm = false;
//        });
//      } else {
//        this.outletService.createOutlet(outletData).subscribe(() => {
//          alert('Outlet added.');
//          this.loadOutlets();
//          this.showOutletForm = false;
//        });
//      }
//    } else {
//      alert('Please fill all outlet fields.');
//    }
//  }

//  // ========== MISC ==========
//  toggleDropdown(event: Event): void {
//    this.dropdownOpen = !this.dropdownOpen;
//    event.stopPropagation();
//  }

//  @HostListener('document:click')
//  closeDropdown(): void {
//    this.dropdownOpen = false;
//  }

//  logout(): void {
//    this.router.navigate(['/login']);
//  }
// }











import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { OutletService } from '../services/outlet.service';
import { Router } from '@angular/router';

@Component({
 selector: 'app-admin-dashboard',
 templateUrl: './admin-dashboard.component.html',
 styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
 userForm!: FormGroup;
 outletForm!: FormGroup;

 users: any[] = [];
 filteredUsers: any[] = [];
 dropdownOpen: boolean = false;
 

 outlets: any[] = [];
 filteredOutlets: any[] = [];

 showUsers: boolean = true;
 showUserForm: boolean = false;
 showOutletForm: boolean = false;
 showOutletList: boolean = false;

 searchQuery: string = '';
 outletSearchQuery: string = '';
 address: string='';

 editingUser: any = null;
 editingOutlet: any = null;

 constructor(
   private fb: FormBuilder,
   private userService: UserService,
   private outletService: OutletService,
   private router: Router
 ) {}

 ngOnInit(): void {
   this.userForm = this.fb.group({
     username: ['', Validators.required],
     email: ['', [Validators.required, Validators.email]],
     role: ['', Validators.required],
     password: ['', Validators.required],
   });

   this.outletForm = this.fb.group({
     name: ['', Validators.required],
     address: ['', Validators.required],
   });

   this.getUsers();
   this.getOutlets();
 }

 getUsers() {
   this.userService.getUsers().subscribe((res: any) => {
     this.users = res;
     this.filteredUsers = res;
   });
 }

 getOutlets() {
   this.outletService.getAllOutlets().subscribe((res: any) => {
     this.outlets = res;
     this.filteredOutlets = res;
     this.address = res.location;
   });
 }

 showAddUserForm(role: string) {
   this.userForm.reset();
   this.userForm.patchValue({ role });
   this.editingUser = null;
   this.showUserForm = true;
   this.showUsers = false;
   this.showOutletForm = false;
   this.showOutletList = false;
 }

 editUser(user: any) {
   this.userForm.patchValue({
     username: user.username,
     email: user.email,
     role: user.role,
     password: '' // force new password
   });
   this.editingUser = user;
   this.showUserForm = true;
   this.showUsers = false;
   this.showOutletForm = false;
   this.showOutletList = false;
 }

 onSubmitUser() {
   if (this.userForm.invalid) {
     alert('Please fill all the details');
     return;
   }

   const userData = this.userForm.value;

   if (this.editingUser) {
     this.userService.updateUser(this.editingUser._id, userData).subscribe(() => {
       this.getUsers();
       this.cancelForm();
     });
   } else {
     this.userService.createUser(userData).subscribe(() => {
       this.getUsers();
       this.cancelForm();
     });
   }
 }

 cancelForm() {
   this.showUserForm = false;
   this.showUsers = true;
 }

 confirmDelete(userId: string) {
   if (confirm('Are you sure you want to delete this user?')) {
     this.userService.deleteUser(userId).subscribe(() => {
       this.getUsers();
     });
   }
 }

 onSearch() {
   const query = this.searchQuery.toLowerCase();
   this.filteredUsers = this.users.filter(user =>
     user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
   );
 }

 toggleOutletList() {
   this.showOutletList = !this.showOutletList;
   this.showUsers = false;
   this.showUserForm = false;
   this.showOutletForm = false;
 }

 showAddOutletForm() {
   this.outletForm.reset();
   this.editingOutlet = null;
   this.showOutletForm = true;
   this.showOutletList = false;
   this.showUsers = false;
   this.showUserForm = false;
 }

 editOutlet(outlet: any) {
   this.outletForm.patchValue(outlet);
   this.editingOutlet = outlet;
   this.showOutletForm = true;
   this.showOutletList = false;
   this.showUsers = false;
   this.showUserForm = false;
 }

 onSubmitOutlet() {
   if (this.outletForm.invalid) {
     alert('Please fill all the details');
     return;
   }

   const outletData = this.outletForm.value;

   if (this.editingOutlet) {
     this.outletService.updateOutlet(this.editingOutlet._id, outletData).subscribe(() => {
      next: ()=>{
        this.getOutlets();
       this.showOutletForm = false;
       this.outletForm.reset();
       this.editingOutlet = null;
       
      }
      error: (error:any)=>{
        console.error('error updating outlet',error)
      }
      alert("successfully added outlet")
       
     });
   } else {
     this.outletService.createOutlet(outletData).subscribe(() => {
      next:{
         this.getOutlets();
       this.showOutletForm = false;
        this.outletForm.reset();
      }
      error:(error:any)=>{
        console.error('Error adding outlet:',error)
      }
      
     });
   }
 }

 toggleDropdown(event: MouseEvent): void {
 event.stopPropagation(); // Prevents click from propagating to document
 this.dropdownOpen = !this.dropdownOpen;
}

 

 onOutletSearch() {
   const query = this.outletSearchQuery.toLowerCase();
   this.filteredOutlets = this.outlets.filter(outlet =>
     outlet.name.toLowerCase().includes(query)
   );
 }

 logout() {
   sessionStorage.clear();
   this.router.navigate(['/']);
 }
}