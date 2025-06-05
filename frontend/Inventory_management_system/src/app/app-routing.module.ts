import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { RolesComponent } from './roles/roles.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';

const routes: Routes = [
  {path:'roles', component: RolesComponent},
  { path:'login/:role', component:LoginComponent },
  {path:"dashboard/admin", component:AdminDashboardComponent},
  {path:"dashboard/manager",component:ManagerDashboardComponent},
  {path:"dashboard/staff",component:StaffDashboardComponent},
  {path:"**",redirectTo:'roles',pathMatch:'full'}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
