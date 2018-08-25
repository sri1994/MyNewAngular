import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ClarityModule } from "@clr/angular";
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import { EmployeeService } from './services/employee.service';
import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions} from '@angular/http';
import {fakeBackendProvider} from './backend/fake-backend';

const appRoutes: Routes = [
  { path: 'login', component: LoginPageComponent},
  { path: 'home', component: HomePageComponent},
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    ClarityModule,
    HttpClientModule,
    HttpModule
  ],
  providers: [EmployeeService,
    HttpClientModule,
    MockBackend,
    fakeBackendProvider,
    BaseRequestOptions],
  bootstrap: [AppComponent]
})
export class AppModule { }
