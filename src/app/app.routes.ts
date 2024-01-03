import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactsComponent } from './phonebook/contacts/contacts.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // Set empty string for home path
  { path:'contacts', component:ContactsComponent },
  { path:'***', component:HomeComponent },
  {  path:'contact/:id',
  loadComponent: () =>
  import('./pages/contact-detail/contact-detail.component').then(c => c.ContactDetailComponent)
  }
];
