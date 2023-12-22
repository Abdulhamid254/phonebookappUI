import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactsComponent } from './phonebook/contacts/contacts.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Set empty string for home path
  { path:'contacts', component:ContactsComponent}
];
