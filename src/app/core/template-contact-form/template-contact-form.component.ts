import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

import { ContactInfo } from '../interfaces/contactFormInfo';
import { ContactService } from '../../service/contact.service';
import { CoreService } from '../../service/core.service';
import { Contact } from '../interfaces/contact';

@Component({
  selector: 'app-template-contact-form',
  standalone: true,
  imports: [MatDialogModule,MatFormFieldModule,CommonModule,FormsModule],
  templateUrl: './template-contact-form.component.html',
  styleUrl: './template-contact-form.component.css'
})
export class TemplateContactFormComponent implements OnInit {


  userInfo: ContactInfo = {
    firstName: 'Abdul',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    id: 0
  }

  // HERE THE BELOW DECORATOR it's used to get a reference to the NgForm directive named 'form' in the component's template

  @ViewChild('form') form: NgForm;

  constructor(    private contactService: ContactService,
    _coreService: CoreService,
    private _dialogRef: MatDialogRef<TemplateContactFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contact: ContactInfo }) {}

    ngOnInit(): void {
      // If data is provided, initialize the form with the existing contact data
      if (this.data && this.data.contact) {
        this.userInfo = { ...this.data.contact };
      }
    }


  // onSubmitForm(form:NgForm, e: SubmitEvent) {
  //   console.log('Form implemented.',form.value);
  //   console.log('This is the native Submi  Event',e);

  //   }

  onFormSubmit(form: NgForm, e: SubmitEvent) {
    if (this.form.valid) {
      if (this.data && this.data.contact) {
        // Update existing contact logic
        this.contactService
          .update$(this.data.contact.id, this.form.value)
          .subscribe({
            next: (val: any) => {
              // this._coreService.openSnackBar('Contact detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        // Add new contact logic
        this.contactService.save$(this.form.value).subscribe({
          next: (val: any) => {
            // this._coreService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }

}
