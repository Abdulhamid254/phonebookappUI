import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomResponse } from '../interfaces/custom-response';
import { Contact } from '../interfaces/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = 'http://localhost:8080';

  // updatePost(postId: number, body: string) {
  //   return this.http
  //     .put(
  //       `${environment.baseApiUrl}/feed/${postId}`,
  //       { body },
  //       this.httpOptions
  //     )
  //     .pipe(take(1));
  // }

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<never>{
    console.log(error);
    return throwError("Method not implemented .")

  }

  contacts$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiUrl}/contact/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
    );


  save$ = (contact:Contact) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/contact/save`, contact)
     .pipe(
     tap(console.log),
     catchError(this.handleError)
    );

    delete$ = (contactId: number) => <Observable<CustomResponse>>
        this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${contactId}`)
          .pipe(
            tap(console.log),
            catchError(this.handleError)
          );

}
