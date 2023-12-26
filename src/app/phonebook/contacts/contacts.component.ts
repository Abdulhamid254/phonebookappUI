import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  BehaviorSubject,
  Observable,
  catchError,
  forkJoin,
  map,
  of,
  startWith,
  take,
} from 'rxjs';
import { AppState } from '../../core/interfaces/app-state';
import { CustomResponse } from '../../core/interfaces/custom-response';
import { DataState } from '../../enum/data-state-enum';
import { ContactService } from '../../service/contact.service';
import { Contact } from '../../core/interfaces/contact';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TemplateContactFormComponent } from '../../core/template-contact-form/template-contact-form.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ConfirmDeleteDialogComponent } from '../../core/confirm-delete-dialog/confirm-delete-dialog.component';
import { CoreService } from '../../service/core.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements OnInit, AfterViewInit {
  appState$: Observable<AppState<CustomResponse>> | undefined;
  selectedContacts: Set<number> = new Set<number>();
  public display: number = 1;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomResponse>(null); // copy of our response
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  form: NgForm;
  sortDirection: 'asc' | 'desc' = 'asc';



  displayedColumns: string[] = [
    'id',
    'select',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'address',
    'username',
    'actions',
  ];
  dataSource$: MatTableDataSource<Contact>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private contactService: ContactService,
    private coreService: CoreService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource$ = new MatTableDataSource<Contact>([]);
    this.getContacts();
  }

  ngAfterViewInit(): void {
    this.dataSource$.sort = this.sort;
  }

// Sorting functions for firstName
sortData(): void {
  const sortMultiplier = this.sortDirection === 'asc' ? 1 : -1;

  this.dataSource$.data = this.dataSource$.data.sort((a, b) => {
    return a.firstName.localeCompare(b.firstName) * sortMultiplier;
  });
}

onSortUpdated(direction: 'asc' | 'desc'): void {
  this.sortDirection = direction;
  this.sortData();
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    this.dataSource$.filter = filterValue.trim().toLowerCase();

  }




  getContacts() {
    this.appState$ = this.contactService.contacts$.pipe(
      take(1),
      map((response: CustomResponse) => {
        this.dataSource$.data = response.data.contacts; // Update the data for MatTableDataSource
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        const customError: Error = new Error(error);
        return of({
          dataState: DataState.ERROR_STATE,
          error: customError,
        });
      })
    );
  }

  saveContact(form: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.contactService.save$(form.value as Contact).pipe(
      take(1),
      map((response: CustomResponse) => {
        const updatedContacts = [
          response.data.contact,
          ...this.dataSubject.value.data.contacts,
        ];
        this.dataSubject.next({
          ...response,
          data: { contacts: updatedContacts },
        });

        // Update MatTableDataSource
        this.dataSource$.data = updatedContacts;
        this.coreService.openSnackBar('Contact added Successfully 👍!');
        document.getElementById('closeModal').click(); // closing the modal the js way
        this.isLoading.next(false);
        form.resetForm();
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        const customError: Error = new Error(error);
        this.isLoading.next(false);
        this.coreService.openSnackBar('Error Occurred ⚠️!');
        return of({ dataState: DataState.ERROR_STATE, error: customError });
      })
    );
  }
  deleteContact(contactId: number): void {
    // Open a confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        count: 1, // You can pass additional data to your dialog if needed
        isMultiple: false,
      }, // Indicates that it's a single deletion
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // User confirmed deletion
        this.performDeleteContact(contactId);
      } else {
        // User canceled deletion
        this.isLoading.next(false);
      }
    });
  }

  private performDeleteContact(contactId: number): void {
    this.isLoading.next(true);

    this.contactService.delete$(contactId).subscribe({
      next: (response: CustomResponse) => {
        const updatedContacts = this.dataSource$.data.filter(
          (s) => s.id !== contactId
        );

        // Update MatTableDataSource
        this.dataSource$.data = updatedContacts;
        this.coreService.openSnackBar('Contact deleted Successfully 👍!');

        // Complete the loading state
        this.isLoading.next(false);

        // Update the dataSubject
        this.dataSubject.next({
          ...response,
          data: { contacts: updatedContacts },
        });
      },
      error: (error: string) => {
        this.coreService.openSnackBar('Error Occureed ⚠️!');

        // Complete the loading state
        this.isLoading.next(false);
      },
    });
  }

  deleteMultipleItems(): void {
    // Open a confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { count: this.selectedContacts.size },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // User confirmed deletion
        this.performDeleteMultipleItems();
      } else {
        // User canceled deletion
        this.isLoading.next(false);
      }
    });
  }

  private performDeleteMultipleItems(): void {
    this.isLoading.next(true);

    const deletionObservables: Observable<CustomResponse>[] = [];

    this.selectedContacts.forEach((contactId) => {
      const deletionObservable: Observable<CustomResponse> = this.contactService
        .delete$(contactId)
        .pipe(
          catchError((error: string) => {
            this.isLoading.next(false);
            this.coreService.openSnackBar(
              `Error deleting contact with ID ${contactId}: ${error} ⚠️!`
            );
            return of(null);
          })
        );

      deletionObservables.push(deletionObservable);
    });

    forkJoin(deletionObservables).subscribe({
      next: (responses: CustomResponse[]) => {
        this.getContacts();

        this.selectedContacts.clear();

        this.isLoading.next(false);
      },
      error: (error: string) => {
        this.coreService.openSnackBar(`Error Occureed ⚠️! ${error}`);

        this.isLoading.next(false);
      },
    });
  }

  openAddEditContactForm(contact: Contact) {
    const dialogRef = this.dialog.open(TemplateContactFormComponent, {
      data: { contact }, // Pass the contact object to the dialog
    });

    dialogRef.afterClosed().subscribe({
      next: (val: unknown) => {
        if (val) {
          this.getContacts();
        }
      },
    });
  }

  toggleAllSelection() {
    if (this.selectedContacts.size === this.dataSource$.data.length) {
      this.selectedContacts.clear();
    } else {
      this.dataSource$.data.forEach((contact) =>
        this.selectedContacts.add(contact.id)
      );
    }
  }

  toggleSelection(contactId: number) {
    if (this.selectedContacts.has(contactId)) {
      this.selectedContacts.delete(contactId);
    } else {
      this.selectedContacts.add(contactId);
    }
  }

  isSelected(contactId: number): boolean {
    return this.selectedContacts.has(contactId);
  }

  // Method to check if all items are selected
  isAllSelected(): boolean {
    return this.selectedContacts.size === this.dataSource$.data.length;
  }

  changeDisplay(mode: number): void {
    this.display = mode;
  }
}
