import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepartmentComponent } from './departments/department/department.component';
import { DepartmentlistComponent } from './departments/departmentlist/departmentlist.component';
import { EmployeeComponent } from './employees/employee/employee.component';
import { EmployeelistComponent } from './employees/employeelist/employeelist.component';

const routes: Routes = [
  {path:"", component: DashboardComponent},
  {path:"dashboard", component: DashboardComponent},
  {path: "department", component: DepartmentComponent},
  {path: "employee", component: EmployeeComponent},
  {path: "departmentlist", component: DepartmentlistComponent},
  {path: "employeelist", component: EmployeelistComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  

 }
