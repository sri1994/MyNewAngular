import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { EmployeeService } from '../services/employee.service';
import { Employee } from '../model/employee';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/finally';
import {uuid} from '../backend/uuid';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  employees: Employee[];
  selectedEmployee: Employee;
  employeeForDialog: Employee;
  displayDialog: boolean;

  get$: Subscription;
  add$: Subscription;
  edit$: Subscription;
  delete$: Subscription;

  employee: Employee = <Employee>new Object();

  constructor(private router: Router, private employeeService: EmployeeService) { 
    
    this.employee.department = 'My department';
    this.employee.firstName = 'Srinivas';
    this.employee.id = uuid.generate();
    this.employee.lastName = 'Prasad';
    this.employee.profession = 'Engineer';
      
    }

  ngOnInit(): void {
    this.get$ = this.employeeService.getEmployees().subscribe(
      employees => {this.employees = employees;
      console.log('employees :', this.employees)},
      error => console.log('error :', error)
    );
  }

  ngOnDestroy() {
    this.get$.unsubscribe();
    // this.edit$.unsubscribe();
    this.delete$.unsubscribe();
    this.add$.unsubscribe();
  }

  // add() {
  //   this.employeeForDialog = {
  //     id: null, firstName: null, lastName: null, profession: null, department: null
  //   };

  //   this.displayDialog = true;
  // }

  // edit() {
  //   if (this.selectedEmployee == null) {
  //     return;
  //   }

  //   this.employeeForDialog = Object.assign({}, this.selectedEmployee);

  //   this.displayDialog = true;
  // }

  public btnClick(event: any): void {

    event.preventDefault()

    this.add$ = this.employeeService.createEmployee(this.employee).subscribe(
      (response: any) => {
        console.log('response :', response);
      },
      error => console.log('error :', error)
    );

    // this.router.navigateByUrl('/home');

  }

  public signUp(): void {
    event.preventDefault()
    // this.get$ = this.employeeService.getEmployees().subscribe(
    //   employees => {this.employees = employees;
    //   console.log('employees :', this.employees)},
    //   error => console.log('error :', error)
    // );

    // this.delete$ = this.employeeService.deleteEmployee(this.employees[8].id).subscribe(
    //   (response: any) => {
    //     console.log('response for delete :', response);
    //   },
    //   error => console.log('error :', error)
    // );

    this.employees[11].firstName = 'srinivasjamadagni94@gmail.com';

    this.delete$ = this.employeeService.updateEmployee(this.employees[8]).subscribe(
      (response: any) => {
        console.log('response for put :', response);
      },
      error => console.log('error :', error)
    );
    
  }
}
