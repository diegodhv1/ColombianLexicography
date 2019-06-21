import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DisplayUserComponent } from './display-user/display-user.component';
import { Routes, RouterModule } from "@angular/router";


const routes: Routes = [
  {
    path: '',
    component: UsersComponent
  },
  {
    path: 'user/:uid',
    component: DisplayUserComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    DisplayUserComponent,
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
