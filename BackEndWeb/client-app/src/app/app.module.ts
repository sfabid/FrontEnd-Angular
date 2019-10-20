import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './app-material.module';
import { MenuComponent } from './menu/menu.component';
import { PatientListComponent } from './patient/paitent-list/patient-list.component';
import { PatientFormComponent } from './patient/patient-form/patient-form.component';
import { PatientService } from './services/patient.service';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PatientListComponent,
    PatientFormComponent,
    HomeComponent
  ],
  entryComponents:[
    PatientFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    AppRoutingModule,   
    HttpClientModule, 
    BrowserAnimationsModule, AppMaterialModule,    
  ],
  providers: [
    PatientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
