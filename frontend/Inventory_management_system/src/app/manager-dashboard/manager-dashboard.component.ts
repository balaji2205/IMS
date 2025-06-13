import { Component, OnInit, HostListener } from '@angular/core';

import { CategoryService } from 'src/app/services/category.service';

import { ProductService } from 'src/app/services/product.service';

import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';



 

@Component({

  selector: 'app-manager-dashboard',

  templateUrl: './manager-dashboard.component.html',

  styleUrls: ['./manager-dashboard.component.css']

})

export class ManagerDashboardComponent implements OnInit {

  dropdownOpen = false;


 

  categories: any[] = [];

  products: any[] = [];

  lowStockItems: any[] = [];

  recentActivities: string[] = [];


 

  totalProducts = 0;

  totalCategories = 0;

  lowStockCount = 0;


 

  selectedCategoryId: string | null = null;

  selectedCategoryName = '';

  showAddForm = false;


 

  newProduct = { name: '', capacity: 0 };

  newCategoryName = '';

  newCategoryImage = '';


 

  internalNotes: string = '';

  outlet: string = '';

  staffList: any[] = [];


 

  outletName: string ='';

  staffName: string = '';

  email: string=''


 

  showingCategories = true;

  showingAddProductForm = false;


 

  showLowStock = false;

  managerName: any;


 

  constructor(

    private categoryService: CategoryService,

    private productService: ProductService,

    private router: Router,

    private http: HttpClient

  ) {}


 

  ngOnInit(): void {

    this.fetchDashboardData();

    this.email = sessionStorage.getItem('email') || '';

    this.outletName=sessionStorage.getItem('outletName')||''// Manager email

    this.staffName=sessionStorage.getItem('staff')||''

const outletIddd=localStorage.getItem('outletId')

console.log(outletIddd);


 

this.http.get<any>(`http://localhost:5000/api/outlets/${outletIddd}/manager`)

  .subscribe(res => {

     this.outletName = res.outletName; // outletName is directly on response

this.managerName = res.manager?.username || 'N/A'; // manager username

this.staffName = res.staff?.username||'N/A'


 

     

  });

  }


 

  fetchDashboardData(): void {

    this.categoryService.getCategories().subscribe((categories) => {

      this.categories = categories;

      this.totalCategories = categories.length;

    });


 

    this.productService.getAllProducts().subscribe((products) => {

      this.products = products;

      this.totalProducts = products.length;

      this.lowStockItems = products.filter((p: any) => p.quantity <= 15);

      this.lowStockCount = this.lowStockItems.length;

    });

  }


 

  toggleProducts(category: any): void {

    if (this.selectedCategoryId === category._id) {

      this.selectedCategoryId = null;

      this.selectedCategoryName = '';

      this.products = [];

      this.showAddForm = false;

    } else {

      this.selectedCategoryId = category._id;

      this.selectedCategoryName = category.name;

      this.loadProducts(category.name);

    }

  }


 

  loadProducts(categoryName: string): void {

    this.productService.getProductsByCategory(categoryName).subscribe((res) => {

      this.products = res.map((product: any) => ({

        ...product,

        capacity: product.quantity

      }));

    });

  }


 

  addCategory(): void {

    if (!this.newCategoryName) {

      alert('Please enter name of category!!!.');

      return;

    }


 

    const newCategory = {

      name: this.newCategoryName,

      image: this.newCategoryImage || 'assets/sample.jpg'

     

    };


 

    this.categoryService.addCategory(newCategory).subscribe({

      next: (data) => {

        this.categories.push(data);

        this.newCategoryName = '';

        // this.newCategoryImage = '';

        this.totalCategories++;

        this.recentActivities.unshift(`Added category '${data.name}'`);

      },

      error: (err) => {

        console.error('Error adding category:', err);

      }

    });

  }


 

  showCategories() {

    this.showingCategories = true;

    this.showingAddProductForm = false;

  }


 

deleteCategory(categoryId: string): void {

  const category = this.categories.find(c => c._id === categoryId);


 

  if (confirm(`Are you sure you want to delete category '${category?.name}'?`)) {

    this.categoryService.deleteCategory(categoryId).subscribe({

      next: () => {

        this.categories = this.categories.filter(c => c._id !== categoryId);

        this.totalCategories--;

        this.recentActivities.unshift(`Deleted category '${category?.name}'`);

        if (this.selectedCategoryId === categoryId) {

          this.selectedCategoryId = null;

          this.products = [];

        }

      },

      error: (err) => {

        console.error('Error deleting category:', err);

      }

    });

  }

}

  showAddProductForm() {

    this.showingCategories = false;

    this.showingAddProductForm = true;

  }


 

  addProduct(): void {

    const payload = {

      name: this.newProduct.name,

      category: this.selectedCategoryName,

      quantity: this.newProduct.capacity,

      threshold: 10,

      createdBy: '6650d6f31f9a0c1a1a000002',

    };


 

    this.productService.addProduct(payload).subscribe({

      next: () => {

        this.loadProducts(this.selectedCategoryName);

        this.showAddForm = false;

        this.newProduct = { name: '', capacity: 0 };

        this.recentActivities.unshift(`Added '${payload.name}' to ${payload.category}`);

        this.totalProducts++;

      },

      error: (err) => {

        console.error('Error adding product:', err);

      }

    });

  }


 

  updateCapacity(product: any): void {

    const payload = { quantity: product.capacity };


 

    this.productService.updateCapacity(product._id, payload).subscribe({

      next: () => {

        alert('Capacity updated successfully');

        this.recentActivities.unshift(`Updated '${product.name}' stock to ${product.capacity}`);

      },

      error: (err) => {

        console.error('Error updating capacity:', err);

      }

    });

  }


 

  deleteProduct(productId: string): void {

    const product = this.products.find(p => p._id === productId);

    this.productService.deleteProduct(productId).subscribe(() => {

      this.loadProducts(this.selectedCategoryName);

      this.totalProducts--;

      this.recentActivities.unshift(`Deleted '${product?.name}'`);

    });

  }


 

  // getAllProducts(){

  //   this.productService.getAllProducts().subscribe((data: any[]) => {

  //     this.products = data;

  //     this.lowStockItems= data.filter(p => p.quantity < p.threshold)

  //   })

  // }


 

  toggleLowStockVisibility(): void {

    this.showLowStock = !this.showLowStock;

  }


 

  generateReport() {

 this.http.get('http://localhost:5000/api/report/stock', { responseType: 'blob' }).subscribe({

 next: (res) => {

   const blob = new Blob([res], { type: 'text/html' });

   const url = window.URL.createObjectURL(blob);

   const a = document.createElement('a');

   a.href = url;

   a.download = 'stock-report.html';

   document.body.appendChild(a);

   a.click();

   document.body.removeChild(a);

   window.URL.revokeObjectURL(url);

 },

 error: (err) => {

   console.error('Error generating report:', err);

   alert('Failed to generate report');

 }

});}


 




 

  toggleDropdown(event: Event): void {

    this.dropdownOpen = !this.dropdownOpen;

    event.stopPropagation();

  }


 

  @HostListener('document:click')

  closeDropdown(): void {

    this.dropdownOpen = false;

  }


 

  logout(): void {

    this.router.navigate(['/login']);

  }

}