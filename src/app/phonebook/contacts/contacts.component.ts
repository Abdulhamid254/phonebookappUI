import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { AppState } from '../../core/interfaces/app-state';
import { CustomResponse } from '../../core/interfaces/custom-response';
import { DataState } from '../../enum/data-state-enum';
import { ContactService } from '../../service/contact.service';
import { Contact } from '../../core/interfaces/contact';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule,FormsModule,MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit, AfterViewInit{
  appState$: Observable<AppState<CustomResponse>> | undefined;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomResponse>(null); // copy of our response
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  form: NgForm;

  dataSource$: MatTableDataSource<Contact>;
  displayedColumns: string[] = ['id', 'firstName', 'lastName','email', 'phoneNumber', 'address', 'username', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private contactService: ContactService) {

  }

  ngOnInit() {
    this.dataSource$ = new MatTableDataSource<Contact>([]);
    this.appState$ = this.contactService.contacts$.pipe(
      map(response => {
        this.dataSource$.data = response.data.contacts; // Set the data for MatTableDataSource
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR_STATE, error: error
        });
      })
    );
  }

  ngAfterViewInit(): void {
    // Set the sort and paginator for MatTableDataSource
    this.dataSource$.sort = this.sort;
    this.dataSource$.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource$.filter = filterValue.trim().toLowerCase();

    if (this.dataSource$.paginator) {
      this.dataSource$.paginator.firstPage();
    }
  }


  saveContact(form: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.contactService.save$(form.value as Contact)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { contacts: [response.data.contact, ...this.dataSubject.value.data.contacts] } }
          );
          // this.notifier.onDefault(response.message);
          document.getElementById('closeModal').click(); // closing the modal the js way
          this.isLoading.next(false);
          form.resetForm();
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoading.next(false);
          // this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
}

deleteContact(contact: Contact): void {
  this.appState$ = this.contactService.delete$(contact.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          { ...response, data:
            { contacts: this.dataSubject.value.data.contacts.filter(s => s.id !== contact.id)} }
        );
        // this.notifier.onDefault(response.message);
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        // this.notifier.onError(error);
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
}

}

/** Builds and returns a new User. */
// function createNewUser(id: number): UserData {
//   const name =
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
//     ' ' +
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
//     '.';

//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
//   };
