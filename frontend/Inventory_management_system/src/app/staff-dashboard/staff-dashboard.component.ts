import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css']
})
export class StaffDashboardComponent implements OnInit {
  dropdownOpen = false;

  categories: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  allProducts:any[]=[];
  selectedCategoryId: string | null = null;
  selectedCategoryName: string = '';

  searchQuery: string = '';
  stockFormVisible: boolean = false;
  searchTerm: string = ''
  totalCategories = 0;
  totalProducts = 0;

  stockChartLabels: string[] = [];
  stockChartData: ChartConfiguration<'bar'>['data']['datasets'] = [];

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.totalCategories = res.length;
        this.loadAllProducts();
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.map((product: any)=>({
          ...product,
          stock: product.stock ?? product.quantity ?? 0
        }));
        this.totalProducts = this.products.length;

        this.filteredProducts = this.products.filter((product:any) =>
          product.category === this.selectedCategoryId)
      

        this.generateCategoryStockData();
        
      },
      error: (err) => {
        console.error('Error loading all products:', err);
      }
    });
  }

  generateCategoryStockData(): void {
    const dataMap: { [key: string]: { name: string; stock: number } } = {};

    for (const product of this.products) {
      const category = this.categories.find(c => c.name === product.category);
      if (!category) continue;

      const categoryName = category.name;

      if (!dataMap[product.categoryName]) {
        dataMap[categoryName] = { name: categoryName, stock: 0 };
      }

      dataMap[categoryName].stock += product.stock || 0;
    }

    const chartData = Object.values(dataMap);
    this.stockChartLabels = chartData.map(d => d.name);
    this.stockChartData = [{
      label: 'Stock',
      data: chartData.map(d => d.stock),
      backgroundColor: 'rgba(54, 162, 235, 0.7)'
    }];
    console.log('chart lables:', this.stockChartLabels);
    console.log('chart data:', this.stockChartData);
    
    
  }

  toggleProducts(category: any): void {
    this.selectedCategoryId = category._id;
    this.selectedCategoryName = category.name;

    if (!this.selectedCategoryId) return;

    this.productService.getAllProducts().subscribe({
      next: (res) => {
        console.log('product from backend',res);
        
        this.products = res.map((product:any)=>({
          ...product,
          stock:product.stock ?? product.quantity ?? 0
        }));
        this.filteredProducts = this.products.filter((product:any)=>
        product.category === category.name)
        console.log('selected categoryid',this.selectedCategoryId);
        console.log('all categoroes',this.categories)
        
      },
      error: (err) => {
        console.error('Error loading products by category:', err);
      }
    });
  }

  showStockForm(action: string): void {
    this.stockFormVisible = true;
    // If future logic is needed for "action", it can be added here
    if(this.products.length && this.categories.length){
      this.generateCategoryStockData();
    }
  }

  onSearch(): void {
  //   if (this.searchQuery) {
  //     this.filteredProducts = this.products.filter(product =>
  //       product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
  //     );
  //   } else {
  //     this.filteredProducts = [...this.products];
  //   }
    
  // }
    const term = this.searchQuery.trim().toLowerCase();
    this.filteredProducts = this.products.filter(product=>
      product.name.toLowerCase().includes(term)
    );
  }

  

  updateStock(): void {
    for (const product of this.filteredProducts) {
      if (product._id && product.stock != null) {
        this.productService.updateCapacity(product._id, { quantity: product.stock }).subscribe({
          next: () => {
            alert(`Stock updated for ${product.name}`);
          },
          error: (err) => {
            console.error(`Failed to update stock for ${product.name}`, err);
          }
        });
      }
    }
  }

  toggleDropdown(event: Event): void {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.dropdownOpen = false;
  }
  tograph(){
    location.reload()
    this.generateCategoryStockData()
    
  }


  logout(): void {
    this.router.navigate(['/login']);
  }
}
