import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CustomResponse } from '../core/interfaces/custom-response';
import { Contact } from '../core/interfaces/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = 'http://localhost:8080';






  constructor(private http: HttpClient) { }

  // private handleError(error: HttpErrorResponse): Observable<never>{
  //   console.log(error);
  //   return throwError("Method not implemented .")

  // }

//fetching all contacts
  contacts$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiUrl}/contact/list`)
  .pipe(
    tap(console.log),
    // catchError(this.handleError)
    );

// getting a single contact
 contact$ = (contactId:number) => <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/contact/get/${contactId}`)
    .pipe(
      tap(console.log)
    )


//saving a contact
  save$ = (contact:Contact) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/contact/save`, contact)
     .pipe(
     tap(console.log),
    //  catchError(this.handleError)
    );


    //deleting a contact
    delete$ = (contactId: number) => <Observable<CustomResponse>>
        this.http.delete<CustomResponse>(`${this.apiUrl}/contact/delete/${contactId}`)
          .pipe(
            tap(console.log),
            // catchError(this.handleError)
          );

          //updating contact
   update$ = (contactId: number, data:Contact) => <Observable<CustomResponse>>
          this.http.put<CustomResponse>(`${this.apiUrl}/contact/update/${contactId}`, data)
            .pipe(
              tap(console.log),
              // catchError(this.handleError)
            );

            filter$ = (response: CustomResponse, filterOptions: { firstName?: string, lastName?: string, username?: string }) => <Observable<CustomResponse>>new Observable<CustomResponse>(
              subscriber => {
                const filteredServers = response.data.contacts!
                  .filter(contact =>
                    (!filterOptions.firstName || contact.firstName === filterOptions.firstName) &&
                    (!filterOptions.lastName || contact.lastName === filterOptions.lastName) &&
                    (!filterOptions.username || contact.username === filterOptions.username)
                  );

                const message = filteredServers.length > 0 ?
                  `Contacts filtered based on criteria` :
                  `No contacts found based on criteria`;

                subscriber.next({
                  ...response,
                  message,
                  data: {
                    contacts: filteredServers
                  }
                });

                subscriber.complete();
              }
            ).pipe(
              tap(console.log),

            );

}
