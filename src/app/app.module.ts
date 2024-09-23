import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Ajoutez cette ligne

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirstComponentComponent } from './first-component/first-component.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TaskListInputComponent } from './task-list-input/task-list-input.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient } from '@angular/common/http'; // Modifiez cette ligne
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { IonicModule } from '@ionic/angular';
import { UsersComponent } from './users/users.component';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Ajoutez cette ligne

import { UserService } from './services/user.service'; // Ajoutez cette ligne
import { TaskApiService } from './services/task-api.service'; // Ajoutez cette ligne
import { AuthService } from './services/auth.service'; // Ajoutez cette ligne

@NgModule({
  declarations: [
    AppComponent,
    FirstComponentComponent,
    TaskListInputComponent,
    TaskListComponent,
    TaskDetailComponent,
    TaskEditComponent,
    LoginComponent,
    SignupComponent,
    TaskCreateComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    AppRoutingModule,
    HttpClientModule, 
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatListModule,
    MatSnackBarModule, 
    IonicModule.forRoot()
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),
    UserService, 
    TaskApiService, 
    AuthService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }