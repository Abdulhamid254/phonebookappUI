import { Component } from '@angular/core';
import { HeaderComponent } from '../../core/header/header.component';
import { ContactsComponent } from "../../phonebook/contacts/contacts.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [HeaderComponent, ContactsComponent]
})
export class HomeComponent {

}
