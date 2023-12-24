import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../../service/contact.service';
import { CommonModule } from '@angular/common';
import { CustomResponse } from '../../core/interfaces/custom-response';
import { CoreService } from '../../service/core.service';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent implements OnInit {
  contact$: CustomResponse;

  constructor(private activatedRoute: ActivatedRoute, private contactService: ContactService,private coreService:CoreService) {}

  ngOnInit(): void {
    // Get the contactId from the route parameters
    const contactId = this.activatedRoute.snapshot.params['id'];

    this.contactService.contact$(contactId).subscribe({
      next: (contact: CustomResponse) => {
        this.coreService.openSnackBar('Contact details retrieved Successfully 👍!');
        this.contact$ = contact;
      },
      error: (error:Error) => {
        this.coreService.openSnackBar('Error Occureed ⚠️!');
      },
    });
  }
}
