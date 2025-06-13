import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';

import { HttpClientModule } from '@angular/common/http';

import { NgChartsModule } from 'ng2-charts';

import { FormsModule } from '@angular/forms';

import { RolesComponent } from './roles/roles.component';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';

import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';





@NgModule({

  declarations: [

    AppComponent,

    LoginComponent,

    RolesComponent,

    AdminDashboardComponent,

    ManagerDashboardComponent,

    StaffDashboardComponent,

  ],

  imports: [

    BrowserModule,

    AppRoutingModule,

    ReactiveFormsModule,

    HttpClientModule,

    FormsModule,

    NgChartsModule

  ],

  providers: [],

  bootstrap: [AppComponent]

})

export class AppModule { }